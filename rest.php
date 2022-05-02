<?php

$metodo = $_SERVER['REQUEST_METHOD'];

$servername = "172.17.0.1:3306";
    $user = "root";
    $pass = "my-secret-pw";
    $db="mydb";
  
    // Create connection
    $conn = mysqli_connect($servername, $user, $pass, $db) or die("Connessione non riuscita". mysqli_connect_error());

  $page= $_GET['page'];
  $size= $_GET['size'];



    if ($metodo == "GET"){
    $a = array();
    $Selectall = "SELECT * FROM employees limit ".$page*$size.','.$size; //select 
    $Selectallr = mysqli_query ($conn, $Selectall) or //risultato
    die ("Query fallita " . mysqli_error($conn) . " " . mysqli_errno($conn));

    header('Content-Type: application/hal+json;charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    
    while ($row = mysqli_fetch_array ($Selectallr, MYSQLI_NUM)) //solo associativo
    {
      $array = array(
    "id"=>$row['0'],
    "birthDate"=>$row['1'],
    "firstName"=>$row['2'],
    "lastName"=>$row['3'],
    "gender"=>$row['4'],
    "hireDate"=>$row['5']
      );
  
       array_push($a, $array);
    }
    $pagine=array();
    $pagine['_embedded']['employees'] = $a;


    
$links=array();

$count = "SELECT count(id) as count from employees"; //select 
    $countr = mysqli_query ($conn, $count) or //risultato
    die ("Query fallita " . mysqli_error($conn) . " " . mysqli_errno($conn));
    while ($row = mysqli_fetch_array ($countr, MYSQLI_NUM)) //solo associativo
{
 $tot=$row[0];

}
$links ["_links"]["prima"]["href"]="http://localhost:8080/rest.php". '?page='. '0' ."&size=".$size;
$links ["_links"]['pag']['href']="http://localhost:8080/rest.php".'?page='.$page.'&size='.$size;
$links ["_links"]['succ']['href']="http://localhost:8080/rest.php".'?page='.($page+1).'&size='.$size;
$links ["_links"]['prece']['href']="http://localhost:8080/rest.php".'?page='.($page-1).'&size='.$size;
$links ["_links"]['ult']['href']="http://localhost:8080/rest.php".'?page='.intval($tot/20).'&size='.$size;

$pages = array('size'=>$size, 'totalElements'=>$tot, 'totalPages'=>intval($tot/20), 'number'=>intval($page));



array_push($pagine, $links);
array_push($pagine, $pages);
echo json_encode($pagine,JSON_UNESCAPED_SLASHES);
//echo json_encode($links,JSON_UNESCAPED_SLASHES);



  }
    if ($metodo == "POST"){
    
      $nome= $_GET['nome'];  
      $cognome= $_GET['cognome'];  

     $insert = "INSERT INTO employees (first_name, last_name)
      VALUES ('$nome','$cognome')";
      
      $insertr = mysqli_query ($conn, $insert) or //risultato
      die ("Query fallita " . mysqli_error($conn) . " " . mysqli_errno($conn));  


  }
    if ($metodo == "PUT"){
    
      $id= $_GET['id'];  
      $nome= $_GET['nome'];  
      $cognome= $_GET['cognome'];  

      $update = "UPDATE employees SET first_name = '$nome' , last_name= '$cognome'  
      WHERE id = '$id'"; //select 
      
      $updater = mysqli_query ($conn, $update) or //risultato
     die ("Query fallita " . mysqli_error($conn) . " " . mysqli_errno($conn));  

  }
    if ($metodo == "DELETE"){
    $id= $_GET['id'];         
 $delete = " DELETE from employees where  id = '$id'"; //select 
 $deleter = mysqli_query ($conn, $delete) or //risultato
die ("Query fallita " . mysqli_error($conn) . " " . mysqli_errno($conn));  
} 
?>    