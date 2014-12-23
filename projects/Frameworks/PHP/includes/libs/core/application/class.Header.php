<?php
namespace core\application
{
	/**
	 * Class Header
	 *
	 * @author Arnaud NICOLAS <arno06@gmail.com>
	 * @version .1
	 * @package core\application
	 */
	class Header
	{
		static public function location($pURL ,$pCode = 301)
		{
			header("Location:".$pURL, true, $pCode);
			exit();
		}

		static public function content_type($pValue, $pCharset = false)
		{
			if(!$pCharset)
				$pCharset = Configuration::$site_encoding;
			header("Content-Type: ".$pValue."; charset=".$pCharset);
		}

		static public function content_description($pValue)
		{
			header("Content-description: ".$pValue);
		}

		static public function status($pValue)
		{
			header("status: ".$pValue);
		}

		static public function http($pValue)
		{
			header("HTTP/".$pValue);
		}
	}
}
