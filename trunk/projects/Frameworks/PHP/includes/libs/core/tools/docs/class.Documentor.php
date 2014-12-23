<?php
namespace core\tools\docs
{
    use core\data\Encoding;
    use core\system\Folder;

    /**
     * Class Documentor
     * Permet le parsing des PHPDoc de classes PHP
     * Gère la génération d'une documentation statique HTML
     * @author Arnaud NICOLAS <arno06@gmail.com>
     * @version 1.0
     * @package core\tools\docs
     */
    class Documentor
    {
        /**
         * @var array
         */
        private $packages = array();

        public function __construct()
        {

        }

        public function parseClass($pClassName)
        {
            $reflec = new \ReflectionClass($pClassName);
            $classInfo = array('details'=>$this->parseDocComment($reflec->getDocComment()),
                                'methods'=>array());
            $methods = $reflec->getMethods();

            for($i = 0, $max = count($methods); $i<$max;$i++)
            {
                $method = $methods[$i];

                if($method->isAbstract()
                    || $method->isPrivate()
                    || $method->isAbstract())
                {
                    continue;
                }

                $classInfo['methods'][] = array('name'=>$method->getName(), 'details'=>$this->parseDocComment($method->getDocComment()));
            }

            return $classInfo;
        }

        public function parsePackage($pPath, $pPackage)
        {
            $classes = array();
            $excluded_ext = '/\.(tpl|tpl\.php|ttf)$/';
            $r = Folder::read($pPath, false);

            foreach($r as $name=>$folder)
            {
                if(is_file($folder['path']))
                {
                    $file = $folder['path'];
                    if(preg_match($excluded_ext, $file, $matches))
                        continue;

                    include_once($file);

                    $parts = explode('.', $file);

                    $className = $pPackage.'\\'.$parts[1];
                    $details = $this->parseClass($className);
                    $classes[$className] = $details;
                    continue;
                }
                $this->parsePackage($folder['path'], $pPackage.'\\'.$name);
            }

            $this->packages = array_merge($this->packages, $classes);

        }

        public function output($pFolder)
        {
            Folder::deleteRecursive($pFolder);
            Folder::create($pFolder);
            Folder::create($pFolder.'/classes');

            $smarty = new \Smarty();
            $smarty->clear_all_assign();
            $smartyDir = "includes/libs/core/tools/docs/templates/_cache/";
            $smarty->template_dir = "includes/libs/core/tools/docs/templates";
            $smarty->cache_dir = $smartyDir;
            $smarty->compile_dir = $smartyDir;

            trace_r($this->packages);

            $classIndex = array();

            foreach($this->packages as $className=>$details)
            {

                $parts = explode("\\", $className);
                $class = array_pop($parts);
                while(in_array($class, $classIndex) && !empty($parts))
                    $class = $class.'\\'.array_pop($parts);

                $file = 'classes/'.str_replace('\\', '_', $class).'.html';

                $classIndex[] = array('name'=>$class, 'href'=>$file);

                $smarty->clear_all_assign();
                $details['name'] = $class;
                $smarty->assign('details', $details);
                file_put_contents($pFolder.$file, Encoding::BOM().$smarty->fetch("template.class_details.tpl"));
            }


            function documentor_cmp_fn($a, $b)
            {
                return strcmp($a['name'], $b['name']);
            }
            usort($classIndex, 'core\\tools\\docs\\documentor_cmp_fn');

            $prefixed_ndx = array();
            foreach($classIndex as $class)
            {
                $firstLetter = strtoupper(substr($class['name'], 0, 1));
                if(!array_key_exists($firstLetter, $prefixed_ndx))
                    $prefixed_ndx[$firstLetter] = array();
                $prefixed_ndx[$firstLetter][] = $class;
            }
            $classIndex = $prefixed_ndx;

            $smarty->clear_all_assign();
            $smarty->assign('classIndex', $classIndex);
            file_put_contents($pFolder.'/classes.html', Encoding::BOM().$smarty->fetch("template.classes.tpl"));

            $smarty->clear_all_assign();
            file_put_contents($pFolder.'/index.html', Encoding::BOM().$smarty->fetch("template.index.tpl"));
        }

        public function parseDocComment($pComments)
        {

            $description = array();
            if(preg_match_all('/\s+\* ([^@].+)\n/i', $pComments, $matches))
            {
                $description = $matches[1];
            }
            $parameters = array();
            if(preg_match_all('/@param\s*([a-z\|]+)\s*\$([a-z\_]+)\s*([^\*]*)\n/i', $pComments, $matches))
            {
                foreach($matches[0] as $i=>$m)
                {
                    $parameters[] = array(
                        "type"=>$matches[1][$i],
                        "name"=>$matches[2][$i],
                        "desc"=>$matches[3][$i]
                    );
                }
            }


            $author = false;
            if(preg_match('/@author\s*([a-z\|\s]+)\s*\<([^\>]+)\>/i', $pComments, $matches))
            {
                $author = array(
                    "name"=>$matches[1],
                    "email"=>$matches[2]
                );
            }

            $return = false;
            if(preg_match('/@return\s*([a-z\|]+)\s*/i', $pComments, $matches))
            {
                $return = array(
                    "type"=>$matches[1]
                );
            }

            $version = false;
            if(preg_match('/@version\s*([0-9a-f\.]+)\s*/i', $pComments, $matches))
            {
                $version = $matches[1];
            }

            $alias = false;
            if(preg_match('/@alias\s*([0-9a-z\_]+)\s*/i', $pComments, $matches))
            {
                $alias = $matches[1];
            }

            $date = false;
            if(preg_match('/@date\s*([0-9]{4})([0-9]{2})([0-9]{2})\s*/i', $pComments, $matches))
            {
                if(count($matches)==4)
                    $date = $matches[3]."/".$matches[2]."/".$matches[1];
            }

            $annexe = array();
            if(preg_match('/@annexe\s*([a-z\_]+)\s*([^@].+)\n/i', $pComments, $matches))
            {
                $annexe = array(
                    'name'=>$matches[1],
                    'content'=>$matches[2]
                );
            }

            return array(
                "return"=>$return,
                "parameters"=>$parameters,
                "description"=>$description,
                "version"=>$version,
                "date"=>$date,
                'alias'=>$alias,
                'annexe'=>$annexe,
                'author'=>$author
            );
        }
    }
}