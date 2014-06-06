<?php
/**
 * Class regroupant des méthodes statiques "utilitaires" pour l'encodage
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .2
 * @package data
 */
abstract class Encoding
{
	/**
	 * Méthode static d'encodage récursif de valeurs dans leurs valeur numériques (é ==> &#233;)
	 * @param object $pValue
	 * @return object
	 */
	static public function toNumericEntities($pValue)
	{
		$convmap = array(0x80, 0xff, 0, 0xff);
        if (is_object($pValue))
            return $pValue;
		if(!is_array($pValue))
			return mb_encode_numericentity($pValue, $convmap, Configuration::$site_encoding);
		foreach($pValue as &$value)
			$value = self::toNumericEntities($value);
		return $pValue;
	}


	/**
	 * @static
	 * @param  $pValue
	 * @return mixed|string
	 */
	static public function fromNumericEntities($pValue)
	{
    	$convmap = array(0x80, 0xff, 0, 0xff);
		if(!is_array($pValue))
		{
			$specialChars = array("&#8221;"=>'"',
								"&#8220;"=>'"',
								"&#8222;"=>'"',
								"&#8211;"=>'-',
								"&#8212;"=>'_',
								"&#8216"=>"'",
								"&#8217"=>"'",
								"&#8218"=>"'");
			foreach($specialChars as $k=>$v)
				$pValue = preg_replace("/".$k."/",$v,$pValue);
			return mb_decode_numericentity($pValue, $convmap, Configuration::$site_encoding);
		}
		foreach($pValue as &$value)
			$value = self::fromNumericEntities($value);
		return $pValue;
	}


	/**
	 * Méthode static d'encodage récursif de valeurs dans leurs valeur HTML (é ==> é)
	 * @param object $pValue
	 * @param int $pQuote
	 * @param string $pCharset
	 * @return object
	 */
	static public function toHTMLEntities($pValue, $pQuote = ENT_QUOTES, $pCharset = false)
	{
		if(!$pCharset)
			$pCharset = Configuration::$site_encoding;
		if(!is_array($pValue))
			return htmlentities($pValue, $pQuote, $pCharset);
		foreach($pValue as &$value)
			$value = self::toHTMLEntities($value, $pQuote, $pCharset);
		return $pValue;
	}

	/**
	 * Méthode static de décodage récursif d'entité HTML dans leur version ISO-8859-1
	 * @param  $pValue
	 * @param int $pQuote
	 * @param string $pCharset
	 * @return string
	 */
	static public function fromHTMLEntities($pValue, $pQuote = ENT_QUOTES, $pCharset = false)
	{
		if(!$pCharset)
			$pCharset = Configuration::$site_encoding;
		if(!is_array($pValue))
			return html_entity_decode($pValue, $pQuote, $pCharset);
		foreach($pValue as &$value)
			$value = self::fromNumericEntities($value, $pQuote, $pCharset);
		return $pValue;
	}


	/**
	 * @static
	 * @param misc $pValue
	 * @return misc
	 */
	static public function fromUTF8($pValue)
	{
		if(is_string($pValue))
			return utf8_decode($pValue);
        if (is_object($pValue))
        {
            $values = get_object_vars($pValue);
            foreach($values as $key=>$value)
                $pValue->$key = self::fromUTF8($value);
        }
        elseif (is_array($pValue))
        {
            foreach($pValue as &$value)
                $value = self::fromUTF8($value);
        }
		return $pValue;
	}
}