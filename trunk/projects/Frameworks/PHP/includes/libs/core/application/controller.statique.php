<?php
/**
 * Controller statique - d&eacute;finit les pages statiques "utilitaires"
 *
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .3
 * @package application
 * @subpackage controller
 */
class statique extends FrontController
{

    public function dependencies()
    {
        $d = new Dependencies();
        $d->retrieve();
    }

    /**
     * M&eacute;thode permettant de redimensionner une image upload&eacute;e (enregistr&eacute;e en base)
     * http://www.site.com/statique/resize/id:2/w:200/h:200/
     *
     * $_GET["id"]		int		Id de l'upload
     * $_GET["w"]		int		largeur max souhait&eacute;e
     * $_GET["h"]		int		hauteur max souhait&eacute;e
     * @return void
     */
    public function resize()
    {
        if(!Form::isNumeric($_GET["id"])||!Form::isNumeric($_GET["w"])||!Form::isNumeric($_GET["h"]))
            Go::to404();
        if(!file_exists($image = ModelUpload::getPathById($_GET["id"])))
            Go::to404();

        preg_match(File::REGEXP_EXTENSION, $image, $extract);
        $ext = $extract[1];
        $folder_cache = "includes/applications/".Configuration::$site_application."/_cache/imgs/";
        $file_cache = $folder_cache."resize_".$_GET["id"]."_".$_GET["w"]."_".$_GET["h"].".".$ext;
        if(Configuration::$site_application!="main")
            Configuration::$server_url .= "../";
        if(file_exists($file_cache))
            Header::location(Configuration::$server_url.$file_cache);

        Image::createCopy($image, $file_cache, $_GET["w"], $_GET["h"]);
//        echo(Configuration::$server_url.$file_cache);
//		        die("f");
        Header::location(Configuration::$server_url.$file_cache);
    }

    /**
     * @return void
     */
    public function captcha()
    {
        if(!Core::checkRequiredGetVars("form", "input"))
            Go::to404();
        $form = $_GET["form"];
        $input = $_GET["input"];
        if(isset($_GET["backoffice"])&&$_GET["backoffice"]==1)
            Core::$isBackoffice = true;
        $form = new Form($form);
        $captcha = $form->getInput($input);
        if(empty($captcha) || $captcha["balise"] != Form::TAG_CAPTCHA)
            Go::to404();

        $avaibles = array("backgroundColor", "fontSizeMax", "fontSizeMin", "width", "height", "rotation","transparent");

        if(!isset($captcha["length"]) || empty($captcha["length"])|| $captcha["length"]==0)
            $captcha["length"] = 5;

        $c = new Captcha($captcha["length"], $input);
        if(isset($captcha["fontColors"]) && is_array($captcha["fontColors"]))
        {
            $a = $captcha["fontColors"];
            for($i = 0, $max = count($a); $i<$max; $i++)
                $c->addFontColor($a[$i]);
        }
        if(isset($captcha["fontFace"]) && is_array($captcha["fontFace"]))
        {
            $a = $captcha["fontFace"];
            for($i = 0, $max = count($a); $i<$max; $i++)
                $c->addFontFace($a[$i]);
        }
        for($i = 0, $max = count($avaibles); $i<$max; $i++)
        {
            if(isset($captcha[$avaibles[$i]])&&!empty($captcha[$avaibles[$i]]))
                $c->$avaibles[$i] = $captcha[$avaibles[$i]];
        }
        $c->render();
        exit();
    }

    /**
     * @return void
     */
    public function autocomplete()
    {
        $datas = null;
        $response = array("error"=>"");
        if(!isset($_GET["form_name"])||empty($_GET["form_name"]))
            $response["error"] = '$_GET["form_name"] require';
        if(!isset($_GET["input_name"])||empty($_GET["input_name"]))
            $response["error"] = '$_GET["input_name"] require';
        if(empty($response["error"]))
        {
            $path_to_form = "includes/applications/".$_GET["application"]."/modules/";
            if($_GET["is_backoffice"])
                $path_to_form .= "back/";
            else
                $path_to_form .= "front/";
            $path_to_form .= "forms/form.".$_GET["form_name"].".json";
            try
            {
                $datas = SimpleJSON::import($path_to_form);
            }
            catch (Exception $e)
            {
                $response["error"] = "Formulaire introuvable ".$path_to_form;
                $this->response($response);
            }
            if(!is_array($datas[$_GET["input_name"]]))
            {
                $response["error"] = "Champs cibl&eacute; introuvable";
                $this->response($response);
            }

            $input = $datas[$_GET["input_name"]];

            if($input["balise"]!=Form::TAG_INPUT || $input["attributes"]["type"]!="text")
            {
                $response["error"] = "Champs cibl&eacute; n'est pas un input type 'text'";
                $this->response($response);
            }

            if(!$input["autoComplete"] || !is_array($input["autoComplete"]))
            {
                $response["error"] = "Les &eacute;l&eacute;ments de bases ne sont pas renseign&eacute;s";
                $this->response($response);
            }
            $model = new $input["autoComplete"]["model"]();
            $cond = Query::condition()->andWhere($input["autoComplete"]["value"], Query::LIKE, "%".$_GET["q"]."%");
            if(isset($input["autoComplete"]["condition"])&&is_array($input["autoComplete"]["condition"])&&count($input["autoComplete"]["condition"]))
            {
                foreach($input["autoComplete"]["condition"] as $m=>$p)
                    call_user_func_array(array($cond, $m), $p);
            }

            if (isset($_GET["replies"]) && Form::isNumeric($_GET["replies"]))
                $result = $model->$input["autoComplete"]["method"]($_GET["replies"]);
            else
                $result = $model->$input["autoComplete"]["method"]($cond, $input["autoComplete"]["value"]);

            $response["responses"] = array();
            foreach($result as $r)
            {
                $d = array("value"=>$r[$input["autoComplete"]["value"]]);
                if(isset($input["autoComplete"]["raw"]) && is_array($input["autoComplete"]["raw"]))
                {
                    foreach($input["autoComplete"]["raw"] as $v)
                        $d[$v] = $r[$v];
                }
                $response["responses"][] =$d;

            }
        }
        $this->response($response);
    }

    /**
     * ATTENTION AU NAME DE L'INPUT
     * ==> FORM[INPUTNAME] <==
     *
     * ATTENTION A LA TECHNIQUE DE RENVOIE D'INFORMATION !M&eacute;thode priv&eacute;e
     *
     * @return void
     */
    public function upload_async()
    {
        $datas = null;
        $response = array("error"=>"");
        if(!isset($_POST["form_name"])||empty($_POST["form_name"]))
            $response["error"] = '$_POST["form_name"] require';
        if(!isset($_POST["input_name"])||empty($_POST["input_name"]))
            $response["error"] = '$_POST["input_name"] require';
        $file = $_FILES[$_POST["input_name"]];
        if(!isset($file)||empty($file))
            $response["error"] = "Aucun fichier n'a &eacute;t&eacute; transmis";
        if(empty($response["error"]))
        {
            Configuration::$site_application = $_POST["application"];
            $path_to_form = "includes/applications/".$_POST["application"]."/modules/";
            if($_POST["is_backoffice"])
                $path_to_form .= "back/";
            else
                $path_to_form .= "front/";
            $form_name = $_POST["form_name"];
            $path_to_form .= "forms/form.".$form_name.".json";
            if (!file_exists($path_to_form))
                $path_to_form = preg_replace("/_[0-9]+\.json$/", ".json", $path_to_form);
            try
            {
                $datas = SimpleJSON::import($path_to_form);
            }
            catch (Exception $e)
            {
                $response["error"] = "Formulaire introuvable ".$path_to_form;
                $this->response($response);
            }

            if(!is_array($datas[$_POST["input_name"]]))
            {
                $response["error"] = "Champs cibl&eacute; introuvable";
                $this->response($response);
            }

            $input = $datas[$_POST["input_name"]];

            if($input["balise"]!=Form::TAG_UPLOAD && ($input["balise"]!="input"&&$input["attributes"]["type"]!="file"))
            {
                $response["error"] = "Champs cibl&eacute; n'est pas un input type 'file'";
                $this->response($response);
            }

            $fileName = "";
            if(isset($input["fileName"]))
                $fileName = "file".(rand(0,999999));
            $folderName = Form::PATH_TO_UPLOAD_FOLDER;
            if(isset($input["folder"]))
                $folderName .= $input["folder"];

            $upload = new Upload($file, $folderName, $fileName);
            if(isset($input["resize"])&&is_array($input["resize"]))
                $upload->resizeImage($input["resize"][0],$input["resize"][1]);
            if(!$upload->isMimeType($input["fileType"]))
            {
                $response["error"] = "Type de fichier non-autoris&eacute; ".$input["fileType"];
                $this->response($response);
            }
            try
            {
                $upload->send();
            }
            catch(Exception $e)
            {
                $response["error"] = "Upload impossible";
                $this->response($response);
            }
            if(isset($input["fileName"])&&!empty($input["fileName"]))
            {
                $fileName = preg_replace("/(\{id\})/", $upload->id_upload, $input["fileName"]);
                $upload->renameFile($fileName);
            }
            $response["path_upload"] = (Configuration::$site_application != "main" ? "../" : "") . $upload->pathFile;
            $response["id_upload"] = $upload->id_upload;
        }
        $this->response($response);
    }

    private function response($response)
    {
        Core::performResponse(json_encode($response), "JSON");
    }
}