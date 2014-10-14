<?php
class index extends FrontController
{
	public function __construct()
	{

 	}

    public function index()
    {

        $this->addContent("titre", "bouboup");
        $f = new Form("dummy");

        $this->addForm('instance', $f);
    }

    public function output()
    {
        $url = "http://www.amazon.fr/dp/B00LGQ5B1K/ref=s9_acsd_al_bw_hr_Sel15W28_1_ot?pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-3&pf_rd_r=15DN8CC9TQ9GAWFRKZ1R&pf_rd_t=101&pf_rd_p=526237687&pf_rd_i=514846031";
        $url = "http://www.amazon.fr/Ampoule-Blanc-Chaud-280LM-220-240V/dp/B00AT6F2AS/ref=sr_1_15?s=lighting&ie=UTF8&qid=1413270991&sr=1-15&keywords=led";
        $file = Request::load($url);

        $p = $this->extractPrice($file);
        $title = $this->extractTitle($file);
        $canonical = $this->extractCanonical($file);

        trace("Prix : ".$p['price']);
        trace("Devise : ".$p['devise']);
        trace("Title : ".$title);
        trace("Canonical : ".$canonical);

    }

    private function extractCanonical($pContent)
    {
        preg_match('/\<link rel="canonical" href="([^\"]+)"/', $pContent, $matches);
        trace($matches);
        return $matches[1];
    }

    private function extractTitle($pContent)
    {
        preg_match('/id="productTitle"[^\>]*\>([^\<]+)/', $pContent, $matches);
        return $matches[1];
    }

    private function extractPrice($pContent)
    {
        preg_match("/\<span class='a-color-price'\>([^\<]+)\<\/span\>/", $pContent, $matches);

        $price = $matches[1];

        preg_match('/(EUR)/', $price, $matches);

        $devise = $matches[1];

        $price = trim(str_replace($devise, '', $price));
        return array("price"=>$price, "devise"=>$devise);
    }
}