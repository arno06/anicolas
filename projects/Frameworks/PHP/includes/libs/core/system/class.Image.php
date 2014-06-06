<?php 
/**
 * Class Image
 * Permet de gérer les traitements en rapport avec les fichiers de type Image
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .4
 * @package system
 */
class Image extends TracingCommands
{
	/**
	 * @type string
	 */
	const JPG = "jpg";
	
	/**
	 * @type string
	 */
	const JPEG = "jpeg";

	/**
	 * @type string
	 */
	const PNG = "png";

	/**
	 * @type string
	 */
	const GIF = "gif";

	/**
	 * Largeur de l'image
	 * @var int
	 */
	public $width;

	/**
	 * Hauteur de l'image
	 * @var int
	 */
	public $height;

	/**
	 * Type d'image souhaitée
	 * @var string
	 */
	public $type;

	/**
	 * constructor
	 * @param int  $pWidth
	 * @param int  $pHeight
	 * @param string $pType
	 * @param int  $pOverSampling
	 */
	public function __construct($pWidth, $pHeight, $pType = self::JPG, $pOverSampling = 1)
	{
		if($pOverSampling<1)
			$pOverSampling = 1;
		$this->width = $pWidth;
		$this->height = $pHeight;
		$this->type = $pType;
		$this->oversampling = $pOverSampling;
	}


	/**
	 * @return void
	 */
	private function draw()
	{
		$ressource = imagecreatetruecolor($this->width*$this->oversampling, $this->height*$this->oversampling);
		if($this->type == self::PNG)
			$this->preparePNG($ressource, $this->width*$this->oversampling, $this->height*$this->oversampling);
		
		$this->drawCommands($ressource);
		
		if($this->oversampling>1)
		{
			$overSampled = imagecreatetruecolor($this->width, $this->height);
			if($this->type == self::PNG)
				self::preparePNG($overSampled, $this->width, $this->height);
			imagecopyresampled($overSampled,$ressource,0,0,0,0,$this->width, $this->height,$this->width*$this->oversampling, $this->height*$this->oversampling);
			imagedestroy($ressource);
			$ressource = &$overSampled;
		}
		
		switch($this->type)
		{
			case self::PNG:
				imagepng($ressource);
		    break;
			case self::JPG:
			case self::JPEG:
				imagejpeg($ressource);
		    break;
			case self::GIF:
				imagegif($ressource);
		    break;
		}
		imagedestroy($ressource);
	}

	/**
	 * @return void
	 */
	public function render()
	{
		header('Content-Type: image/'.$this->type);
		$this->draw();
	}


	/**
	 * @static
	 * @param resource $pRessource
	 * @param int $pWidth
	 * @param int $pHeight
	 * @return void
	 */
	static private function preparePNG(&$pRessource, $pWidth, $pHeight)
	{
		imagesavealpha($pRessource, true);
		imagealphablending($pRessource, false);
		$transparent = imagecolorallocatealpha($pRessource, 0, 0, 0, 127);
		imagefilledrectangle($pRessource, 0, 0, ($pWidth)-1, ($pHeight)-1, $transparent);
		imagealphablending($pRessource, true);
	}




    public function createCache($pFinalImage, $pMaxWidth, $pMaxHeight, $pWaterMark = null)
    {
        $ressource = imagecreatetruecolor($this->width*$this->oversampling, $this->height*$this->oversampling);
        if($this->type == self::PNG)
            $this->preparePNG($ressource, $this->width*$this->oversampling, $this->height*$this->oversampling);

        $this->drawCommands($ressource);

        if($this->oversampling>1)
        {
            $overSampled = imagecreatetruecolor($this->width, $this->height);
            if($this->type == self::PNG)
                self::preparePNG($overSampled, $this->width, $this->height);
            imagecopyresampled($overSampled,$ressource,0,0,0,0,$this->width, $this->height,$this->width*$this->oversampling, $this->height*$this->oversampling);
            imagedestroy($ressource);
            $ressource = &$overSampled;
        }

        $TailleRedim = self::getProportionResize($this->width, $this->height, $pMaxWidth, $pMaxHeight);
        $ImageTampon = imagecreatetruecolor($TailleRedim["width"], $TailleRedim["height"]);
        imagecopyresampled($ImageTampon,$ressource,0,0,0,0,$TailleRedim["width"], $TailleRedim["height"],$this->width, $this->height);
        imagedestroy($ressource);
        $ressource = &$ImageTampon;

        self::addWaterMark($ressource, $pWaterMark);

        switch ($this->type) {
            case self::JPG:
            case self::JPEG:
                imagejpeg($ressource, $pFinalImage, 100);
                break;
            case self::GIF:
                imagegif($ressource, $pFinalImage);
                break;
            case self::PNG:
                imagepng($ressource, $pFinalImage);
                break;
            default:
                return false;
                break;
        }
        imagedestroy($ressource);
        chmod($pFinalImage, 0666);
        return true;
    }

    /**
     * Méthode static de creation d'une copie d'une image avec redimensionnement
     * @param String $pSourceImage				Fichier source
     * @param String $pFinalImage				Fichier que l'on souhaite créer
     * @param float $pMaxWidth					Largeur du nouveau fichier
     * @param float $pMaxHeight				Hauteur du nouveau fichier
     * @param array $pWaterMark				        Watermark
     * @return Boolean
     */
    static public function createCopy($pSourceImage, $pFinalImage, $pMaxWidth, $pMaxHeight, $pWaterMark = null) {
        if (!file_exists($pSourceImage))
            return false;
        if (file_exists($pFinalImage))
            chmod($pFinalImage, 0666);
        if (!$type = self::isImage($pSourceImage))
            return false;
        $size = self::getSize($pSourceImage);
        $currentWidth = $size[0];
        $currentHeight = $size[1];

        $TailleRedim = self::getProportionResize($currentWidth, $currentHeight, $pMaxWidth, $pMaxHeight);
        $ImageTampon = imagecreatetruecolor($TailleRedim["width"], $TailleRedim["height"]);
        switch ($type) {
            case self::JPG:
            case self::JPEG:
                $ImageTampon2 = imagecreatefromjpeg($pSourceImage);
                imagecopyresampled($ImageTampon, $ImageTampon2, 0, 0, 0, 0, $TailleRedim["width"], $TailleRedim["height"], $currentWidth, $currentHeight);
                self::addWaterMark($ImageTampon, $pWaterMark);
                imagejpeg($ImageTampon, $pFinalImage, 100);
                break;
            case self::GIF:
                $ImageTampon2 = imagecreatefromgif($pSourceImage);
                imagecopyresampled($ImageTampon, $ImageTampon2, 0, 0, 0, 0, $TailleRedim["width"], $TailleRedim["height"], $currentWidth, $currentHeight);
                self::addWaterMark($ImageTampon, $pWaterMark);
                imagegif($ImageTampon, $pFinalImage);
                break;
            case self::PNG:
                $ImageTampon2 = imagecreatefrompng($pSourceImage);
                self::preparePNG($ImageTampon, $TailleRedim["width"], $TailleRedim["height"]);
                imagecopyresampled($ImageTampon,$ImageTampon2,0,0,0,0,$TailleRedim["width"],$TailleRedim["height"],$currentWidth,$currentHeight);
                self::addWaterMark($ImageTampon, $pWaterMark);
                imagepng($ImageTampon, $pFinalImage);
                break;
            default:
                return false;
                break;
        }
        imagedestroy($ImageTampon);
        imagedestroy($ImageTampon2);
        chmod($pFinalImage, 0666);
        return true;
    }

    static public function addWaterMark(&$pSourceStamp, $pWaterMark)
    {
        if (!$pWaterMark || !is_array($pWaterMark) || !isset($pWaterMark["file"]) || !isset($pWaterMark["x"]) || !isset($pWaterMark["y"]))
            return false;
        if (!file_exists($pWaterMark["file"]))
            return false;
        if (!$type = self::isImage($pWaterMark["file"]))
            return false;
        switch ($type) {
            case self::JPG:
            case self::JPEG:
                $ImageTampon2 = imagecreatefromjpeg($pWaterMark["file"]);
                break;
            case self::GIF:
                $ImageTampon2 = imagecreatefromgif($pWaterMark["file"]);
                break;
            case self::PNG:
                $ImageTampon2 = imagecreatefrompng($pWaterMark["file"]);
                break;
            default:
                return false;
                break;
        }
        $x = $pWaterMark["x"];
        $y = $pWaterMark["y"];
        if ($pWaterMark["x"] < 0)
            $x = imagesx($pSourceStamp) + $pWaterMark["x"];
        if ($pWaterMark["y"] < 0)
            $y = imagesy($pSourceStamp) + $pWaterMark["y"];
        imagecopy($pSourceStamp, $ImageTampon2, $x, $y, 0, 0, imagesx($ImageTampon2), imagesy($ImageTampon2));
        imagedestroy($ImageTampon2);
        return $pSourceStamp;
    }


    /**
     * Méthode de redimensionnement d'une image existante
     * @param String $pSourceImage				Chemin de l'image &agrave; redimensionner
     * @param float $pMaxWidth						Largeur maximale souhaitée
     * @param float $pMaxHeight					Hauteur maximale souhaitée
     * @return Boolean
     */
    static public function resize($pSourceImage, $pMaxWidth, $pMaxHeight) {
        $size = self::getSize($pSourceImage);
        $currentWidth = $size[0];
        $currentHeight = $size[1];
        if (($pMaxWidth > $currentWidth) && ($pMaxHeight > $currentHeight))
            return true;
        $TailleRedim = self::getProportionResize($currentWidth, $currentHeight, $pMaxWidth, $pMaxHeight);
        return self::createCopy($pSourceImage, $pSourceImage, $TailleRedim["width"], $TailleRedim["height"]);
    }

	
    /**
     * Méthode de calcul de dimension apr&egrave;s redimensionnement en concervant les proportions
     * @param Number $pWidth			Largeur actuelle
     * @param Number $pHeight			Hauteur actuelle
     * @param float $pMaxWidth			Largeur max
     * @param float $pMaxHeight		Hauteur max
     * @return Array
     */
    static public function getProportionResize($pWidth, $pHeight, $pMaxWidth, $pMaxHeight) {
        $TestW = round($pMaxHeight / $pHeight * $pWidth);
        $TestH = round($pMaxWidth / $pWidth * $pHeight);
        if ($TestW > $pMaxWidth) {
            $width = $pMaxWidth;
            $height = $TestH;
        } elseif ($TestH > $pMaxHeight) {
            $width = $TestW;
            $height = $pMaxHeight;
        } else {
            $width = $pMaxWidth;
            $height = $pMaxHeight;
        }
        return array("width"=>$width, "height"=>$height);
    }

	
    /**
     * Récup&egrave;re la hauteur et la largeur d'un fichier
     * @param String $pSourceImage				Fichier source dont on souhaite récupérer la taille
     * @return Array
     */
    static public function getSize($pSourceImage) {
        return getimagesize($pSourceImage);
    }

    
    /**
     * Méthode permettant de vérifier si le fichier est bien une image (jpg, gif ou png)
     * @param String $pSourceImage				Fichier source
     * @return String
     */
    static public function isImage($pSourceImage) {
        $extract = array();
        if (preg_match('/^.*\.('.self::JPEG.'|'.self::JPG.'|'.self::GIF.'|'.self::PNG.')$/i', $pSourceImage, $extract))
            return strtolower($extract[1]);
		return "";
    }
}
/**
 * Class TracingCommands
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package system
 */
class TracingCommands
{

	/**
	 * @type string
	 */
	const COMMAND_MOVETO            = "command_moveto";

	/**
	 * @type string
	 */
	const COMMAND_LINETO            = "command_lineto";

	/**
	 * @type string
	 */
	const COMMAND_SETLINESTYLE      = "command_setlinestyle";

	/**
	 * @type string
	 */
	const COMMAND_BEGINFILL         = "command_beginfill";

	/**
	 * @type string
	 */
	const COMMAND_ENDFILL           = "command_endfill";

	/**
	 * @type string
	 */
	const COMMAND_DRAWCIRCLE        = "command_drawcircle";

	/**
	 * @type string
	 */
	const COMMAND_DRAWELLIPSE       = "command_drawellipse";

	/**
	 * @type string
	 */
	const COMMAND_DRAWTEXT          = "command_drawtext";

	/**
	 * @type string
	 */
	const COMMAND_DRAWRECT          = "command_drawrect";

	/**
	 * @type string
	 */
	const COMMAND_SETPIXEL          = "command_setpixel";

    /**
     * @type string
     */
    const COMMAND_DRAWIMAGE         = "command_drawimage";

    /**
     * @type string
     */
    const COMMAND_CREATEIMAGE         = "command_createimage";

	/**
	 * @var array
	 */
	private $command;

	/**
	 * @var int
	 */
	protected $oversampling = 1;

	
	/**
	 * Constructor
	 */
	public function __construct()
	{
		$this->command = array();
	}


	/**
	 * Méthode de définition du style de ligne souhaité
	 * @param int $pR
	 * @param int $pG
	 * @param int $pB
	 * @param int $pSize
	 * @return void
	 */
	public function setLineStyle($pR = 0, $pG = 0, $pB = 0, $pSize = 1)
	{
		$this->command[] = array("type"=>self::COMMAND_SETLINESTYLE,"r"=>$pR, "g"=>$pG, "b"=>$pB, "size"=>$pSize);
	}


	/**
	 * Méthode de définition de la couleur de remplissage
	 * @param number  $pR
	 * @param number  $pG
	 * @param number  $pB
	 * @return void
	 */
	public function beginFill($pR, $pG, $pB)
	{
		$this->command[] = array("type"=>self::COMMAND_BEGINFILL, "r"=>$pR, "g"=>$pG, "b"=>$pB);
	}

    /**
     * @param $pSrc
     * @param $pWidth
     * @param $pHeight
     */
    public function drawImage($pSrc, $pWidth, $pHeight)
    {
        $this->command[] = array("type"=>self::COMMAND_DRAWIMAGE, "src"=>$pSrc, "width"=>$pWidth, "height"=>$pHeight);
    }

    /**
     * @param $pSrc
     * @param $pWidth
     * @param $pHeight
     * @param $pPadding
     */
    public function createImage($pSrc, $pWidth, $pHeight, $pPadding)
    {
        $this->command[] = array("type"=>self::COMMAND_CREATEIMAGE, "src"=>$pSrc, "width"=>$pWidth, "height"=>$pHeight, "padding"=>$pPadding);
    }


	/**
	 * Méthode permettant de mettre fin au remplissage
	 * @return void
	 */
	public function endFill()
	{
		$this->command[] = array("type"=>self::COMMAND_ENDFILL);
	}


	/**
	 * @param int  $pX
	 * @param int  $pY
	 * @return void
	 */
	public function moveTo($pX, $pY)
	{
		$this->command[] = array("type"=>self::COMMAND_MOVETO, "x"=>$pX, "y"=>$pY);
	}


	/**
	 * @param int  $pX
	 * @param int  $pY
	 * @return void
	 */
	public function lineTo($pX, $pY)
	{
		$this->command[] = array("type"=>self::COMMAND_LINETO,"x"=>$pX, "y"=>$pY);
	}


	/**
	 * Méthode de dessin d'un texte sur l'image
	 * @param string  $pString
	 * @param int  $pSize
	 * @param string  $pFont
	 * @param int $pX
	 * @param int $pY
	 * @param int $pR
	 * @param int $pG
	 * @param int $pB
	 * @param int $pRotation
	 * @return void
	 */
	public function drawText($pString, $pSize, $pFont, $pX=0, $pY=0, $pR=0, $pG=0, $pB=0, $pRotation = 0)
	{
		$this->command[] = array("type"=>self::COMMAND_DRAWTEXT, "text"=>$pString, "size"=>$pSize, "font"=>$pFont, "x"=>$pX, "y"=>$pY, "r"=>$pR, "g"=>$pG, "b"=>$pB, "rotation"=>$pRotation);
	}


	/**
	 * Méthode de dessin d'un cercle
	 * @param int $pX
	 * @param int $pY
	 * @param int $pRadius
	 * @return void
	 */
	public function drawCircle($pX, $pY, $pRadius)
	{
		$this->command[] = array("type"=>self::COMMAND_DRAWCIRCLE, "x"=>$pX, "y"=>$pY, "width"=>$pRadius*2, "height"=>$pRadius*2);
	}


	/**
	 * Méthode de dessin d'une ellipse
	 * @param int $pX
	 * @param int $pY
	 * @param int $pWidth
	 * @param int $pHeight
	 * @return void
	 */
	public function drawEllipse($pX, $pY, $pWidth, $pHeight)
	{
		$this->command[] = array("type"=>self::COMMAND_DRAWELLIPSE, "x"=>$pX, "y"=>$pY, "width"=>$pWidth, "height"=>$pHeight);
	}


	/**
	 * Méthode de dessin d'un rectangle
	 * @param int $pX
	 * @param int $pY
	 * @param int $pWidth
	 * @param int $pHeight
	 * @return void
	 */
	public function drawRectangle($pX, $pY, $pWidth, $pHeight)
	{
		$this->moveTo($pX, $pY);
		$this->lineTo($pX+$pWidth, $pY);
		$this->lineTo($pX+$pWidth, $pY+$pHeight);
		$this->lineTo($pX, $pY+$pHeight);
		$this->lineTo($pX, $pY);
	}


	/**
	 * @param int $pX
	 * @param int $pY
	 * @param int $pR
	 * @param int $pG
	 * @param int $pB
	 * @return void
	 */
	public function setPixel($pX, $pY, $pR = 0, $pG = 0, $pB = 0)
	{
		$this->command[] = array("type"=>self::COMMAND_SETPIXEL, "x"=>$pX, "y"=>$pY, "r"=>$pR, "g"=>$pG, "b"=>$pB);
	}


	/**
	 * @param resource  $pRessource
	 * @return void
	 */
    protected function drawCommands($pRessource)
    {
        $tmp = array("x"=>"0", "y"=>"0");
        $path = array();
        $drawingPolygon = false;
        $fill_color = -1;
        $line_color = -1;
        $props = array("x", "y", "width", "height", "size");
        $mProps = count($props);
        $hasGraduate = false;
        for($i = 0, $max = count($this->command); $i<$max;$i++)
        {
            $cmd = $this->command[$i];
            if(!isset($cmd["type"]))
                continue;
            for($k = 0;$k<$mProps;$k++)
                $cmd[$props[$k]] = $cmd[$props[$k]] * $this->oversampling;
            switch($cmd["type"])
            {
                case self::COMMAND_DRAWIMAGE:
                    $type = Image::isImage($cmd["src"]);
                    if(empty($type))
                        trigger_error("L'image � copier ne correspond pas � un type compatible", E_USER_ERROR);
                    $ress = null;
                    switch($type)
                    {
                        case Image::PNG:
                            $ress = imagecreatefrompng($cmd["src"]);
                            break;
                        case Image::JPEG:
                        case Image::JPG:
                            $ress = imagecreatefromjpeg($cmd["src"]);
                            break;
                        case Image::GIF:
                            $ress = imagecreatefromgif($cmd["src"]);
                            break;
                    }
                    imagecopyresampled($pRessource, $ress, 0, 0, 0, 0, $cmd["width"], $cmd["height"], $cmd["width"], $cmd["height"]);
                    break;
                case self::COMMAND_CREATEIMAGE:
                    $type = Image::isImage($cmd["src"]);
                    if(empty($type))
                        trigger_error("L'image � copier ne correspond pas � un type compatible", E_USER_ERROR);
                    $ress = null;
                    switch($type)
                    {
                        case Image::PNG:
                            $ress = imagecreatefrompng($cmd["src"]);
                            break;
                        case Image::JPEG:
                        case Image::JPG:
                            $ress = imagecreatefromjpeg($cmd["src"]);
                            break;
                        case Image::GIF:
                            $ress = imagecreatefromgif($cmd["src"]);
                            break;
                    }


                    for($x = 0 ; $x < 50 ; $x++)
                    {
                        for($y = 0 ; $y < 50 ; $y++)
                        {
                            $color = imagecolorat($ress, $x, $y);
                            $r = ($color >> 16) & 0xFF;
                            $g = ($color >> 8) & 0xFF;
                            $b = $color & 0xFF;
                            if ($r < 30 && $g < 30 && $b < 30)
                            {
                                $hasGraduate = true;
                                break 2;
                            }
                        }
                    }


                    $rgb = imagecolorat($ress, $cmd["width"]/2, 0);
                    $r = ($rgb >> 16) & 0xFF;
                    $g = ($rgb >> 8) & 0xFF;
                    $b = $rgb & 0xFF;

                    $background = imagecolorallocate($pRessource, $r, $g, $b);
                    imagefill($pRessource, 0, 0, $background);
                    imagecopy($pRessource, $ress, $cmd["padding"][3], $cmd["padding"][0], 0, 0, $cmd["width"], $cmd["height"]);

                    break;
                case self::COMMAND_SETLINESTYLE:
                    $line_color = imagecolorallocate($pRessource, $cmd["r"], $cmd["g"], $cmd["b"]);
                    imagesetstyle($pRessource, array($line_color));
                    imagesetthickness ($pRessource, $cmd["size"]);
                    break;
                case self::COMMAND_BEGINFILL:
                    $fill_color = imagecolorallocate($pRessource, $cmd["r"], $cmd["g"], $cmd["b"]);
                    $drawingPolygon = true;
                    $path = array();
                    break;
                case self::COMMAND_ENDFILL:
                    if(count($path)<3||!$drawingPolygon)
                    {
                        $drawingPolygon = false;
                        $fill_color = -1;
                        $path = array();
                        continue;
                    }
                    if($fill_color>-1)
                        imagefilledpolygon($pRessource, $path, count($path)/2, $fill_color);
                    if($line_color>-1)
                        imagepolygon($pRessource, $path, count($path)/2, $line_color);
                    $drawingPolygon = false;
                    $fill_color = -1;
                    $path = array();
                    break;
                case self::COMMAND_MOVETO:
                    if($drawingPolygon)
                        array_push($path, $cmd["x"], $cmd["y"]);
                    $tmp = array("x"=>$cmd["x"], "y"=>$cmd["y"]);
                    break;
                case self::COMMAND_LINETO:
                    if ($hasGraduate)
                        break;

                    if($drawingPolygon)
                        array_push($path, $cmd["x"], $cmd["y"]);
                    else
                        imageline($pRessource, $tmp["x"], $tmp["y"], $cmd["x"], $cmd["y"], IMG_COLOR_STYLED);
                    $tmp = array("x"=>$cmd["x"], "y"=>$cmd["y"]);
                    break;
                case self::COMMAND_DRAWCIRCLE:
                case self::COMMAND_DRAWELLIPSE:
                    if($fill_color>-1)
                        imagefilledellipse($pRessource, $cmd["x"], $cmd["y"], $cmd["width"], $cmd["height"], $fill_color);
                    if($line_color>-1)
                        imageellipse($pRessource, $cmd["x"], $cmd["y"], $cmd["width"], $cmd["height"], $line_color);
                    break;
                case self::COMMAND_DRAWTEXT:
                    $c = imagecolorallocate($pRessource, $cmd["r"], $cmd["g"], $cmd["b"]);
                    imagettftext($pRessource, $cmd["size"], $cmd["rotation"], $cmd["x"], $cmd["y"], $c, $cmd["font"], $cmd["text"]);
                    break;
                case self::COMMAND_DRAWRECT:
                    if($fill_color>-1)
                        imagefilledrectangle($pRessource, $cmd["x"], $cmd["y"], $cmd["x1"], $cmd["y1"], $fill_color);
                    if($line_color>-1)
                        imagerectangle($pRessource, $cmd["x"], $cmd["y"], $cmd["x1"], $cmd["y1"], $line_color);
                    break;
                case self::COMMAND_SETPIXEL:
                    $c = imagecolorallocate($pRessource, $cmd["r"], $cmd["g"], $cmd["b"]);
                    imagesetpixel($pRessource, $cmd["x"], $cmd["y"], $c);
                    break;
                default:
                    continue;
                    break;
            }
        }
    }
}