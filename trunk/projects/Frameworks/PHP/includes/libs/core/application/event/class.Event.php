<?php
/**
 * Class Event
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package application
 * @subpackage event
 */
class Event
{
    public $type;

    public $args;

    /**
     * @var EventDispatcher
     */
    public $target;

    public function __construct($pType)
    {
        $this->type = $pType;
        $this->args = array();
        $count = func_num_args();
        if ($count > 1)
        {
            $arguments = func_get_args();
            for($i = 1 ; $i < $count ; $i++)
            {
                $this->args[] = $arguments[$i];
            }
        }
    }

    public function __clone()
    {
        return new Event($this->type);
    }

    public function __toString()
    {
        return "Event ".$this->type;
    }
}