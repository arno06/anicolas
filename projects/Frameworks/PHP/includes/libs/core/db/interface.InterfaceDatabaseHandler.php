<?php
/**
 * Interface pour les gestionnaires de base de données
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .3
 * @package db
 */
interface InterfaceDatabaseHandler
{
	/**
	 * Méthode d'execution d'une requ�te SQL
	 * @param String $pQuery				Requ�te SQL brute
	 * @return ressource
	 */
	public function execute($pQuery);
	
	
	/**
	 * Méthode permettant de récupérer les donnée d'une requ�tes SQL
	 * Renvoie les données renvoyées sous forme d'un tableau associatif
	 * @param String $pQuery				Requ�te SQL brute
	 * @return array
	 */
	public function getResult($pQuery);
	
	
	/**
	 * Méthode de récupération de lé clé primaire venant d'�tre générée par la base de données
	 * @return int
	 */
    public function getInsertId();

	/**
	 * @abstract
	 * @return int
	 */
	public function getErrorNumber();

	/**
	 * @abstract
	 * @return string
	 */
	public function getError();
}