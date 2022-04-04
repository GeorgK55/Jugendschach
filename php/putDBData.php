<?php

$DesiredFunction = $_POST['dataContext'];
//echo "Erkannt: ".$DesiredFunction;

include ('dbaccount.php');

try {
  $pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
} catch (PDOException $e) {
  echo "Fehler!: " . $e->getMessage() . "<br/>";
  die();
}

$responsearray = [
	"ergebnisflag"	=> "",
	"ergebnistext"	=> "",
	"neueid"				=> "",
	"sql"						=> "",
	"errorinfo0"		=> "",
	"errorinfo1"		=> "",
	"errorinfo2"		=> ""
];

//===========================================================================
if($DesiredFunction == 'AufgabeSpeichern') {

  $Kurztext     = $_POST['Kurztext'];
  $Langtext     = $_POST['Langtext'];
  $Quelle       = $_POST['Quelle'];
  $Quelledetail = $_POST['Quelledetail'];
  $ImportQuelle = $_POST['ImportQuelle'];
  $Ab           = date();
  $AmZug        = $_POST['AmZug'];
  $FEN          = $_POST['FEN'];
  $Scope        = $_POST['Scope'];
  $Skill        = $_POST['Skill'];
  $studie       = $_POST['studie'];
  $kapitel      = $_POST['kapitel'];
  $pgn          = $_POST['pgn'];

  $sqlcmd_Aufgabe = $pdo->prepare("INSERT INTO T_Aufgaben (Kurztext, Langtext, Quelle, Quelledetail, ImportQuelle, Ab, AmZug, FEN, Scope, Skill, lichess_studie, lichess_kapitel, PGN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )");
  if($sqlcmd_Aufgabe->execute(array($Kurztext, $Langtext, $Quelle, $Quelledetail, $ImportQuelle, $Ab, $AmZug, $FEN, $Scope, $Skill, $studie, $kapitel, $pgn))) {
 
		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Neue Aufgabe erfolgreich eingetragen";	
		$responsearray["neueid"]				= $pdo->lastInsertId();;	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_Aufgabe->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_Aufgabe->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_Aufgabe->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_Aufgabe->errorInfo()[2];

	echo json_encode($responsearray);
}   
//===========================================================================
if($DesiredFunction == 'AufgabeEntfernen') {

  $sqlcmd_Aufgabe = $pdo->prepare("DELETE FROM T_Aufgaben WHERE Id = " . $_POST['AufgabeID']);
  if($sqlcmd_Aufgabe->execute()) {

		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Aufgabe erfolgreich entfernt";	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_Aufgabe->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_Aufgabe->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_Aufgabe->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_Aufgabe->errorInfo()[2];

	echo json_encode($responsearray);
}


//===========================================================================
if($DesiredFunction == 'Zugliste') {

  $Zugliste			= $_POST["Zugliste"];

  $sqlcmd_Zugliste = $pdo->prepare("INSERT INTO T_Zuege (" . 
        "AufgabeID," .
        "FEN," .
        "NAG," .
        "CurMoveIndex," .
        "CurMoveId," .
        "PreMoveId," .
        "ZugNummer," .
        "ZugLevel," .
        "ZugFarbe," .
        "ZugOriginal," .
        "ZugFigur," .
        "ZugVon," .
        "ZugNach," .
        "ZugKurz," .
        "ZugLang," .
        "ZugStockfish," .
        "ZugAktion," .
        "ZugUmwandlung," .
        "ZugZeichen," .
        "Hinweistext," .
        "Hinweispfeil) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
 
  $ImportCounter = 0;

  for($i=0;$i<count($Zugliste); $i++) {

    if($sqlcmd_Zugliste->execute(array(
      $_POST['AufgabenID'],
      $Zugliste[$i]['FEN'],
      $Zugliste[$i]['NAG'],
      $Zugliste[$i]['CurMoveIndex'],
      $Zugliste[$i]['CurMoveId'],
      $Zugliste[$i]['PreMoveId'],
      $Zugliste[$i]['ZugNummer'],
      $Zugliste[$i]['ZugLevel'],
      $Zugliste[$i]['ZugFarbe'],
      $Zugliste[$i]['ZugOriginal'],
      $Zugliste[$i]['ZugFigur'],
      $Zugliste[$i]['ZugVon'],
      $Zugliste[$i]['ZugNach'],
      $Zugliste[$i]['ZugKurz'],
      $Zugliste[$i]['ZugLang'],
      $Zugliste[$i]['ZugStockfish'],
      $Zugliste[$i]['ZugAktion'],
      $Zugliste[$i]['ZugUmwandlung'],
      $Zugliste[$i]['ZugZeichen'],
      $Zugliste[$i]['Hinweistext'],
      $Zugliste[$i]['Hinweispfeil']))) {

      $ImportCounter = $ImportCounter + 1;

    } else {

			$responsearray["ergebnisflag"]	= false;
			$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
			$responsearray["sql"]						= $sqlcmd_Zugliste->queryString;
			$responsearray["errorinfo0"]		= $sqlcmd_Zugliste->errorInfo()[0];
			$responsearray["errorinfo1"]		= $sqlcmd_Zugliste->errorInfo()[1];
			$responsearray["errorinfo2"]		= $sqlcmd_Zugliste->errorInfo()[2];

			echo json_encode($responsearray);
			return;
    }

  }

	$responsearray["ergebnisflag"]	= true;
	$responsearray["ergebnistext"]	= "Zur neuen Aufgabe wurden " . $ImportCounter . " Züge erfolgreich eingetragen";
	$responsearray["sql"]						= $sqlcmd_Zugliste->queryString;
	$responsearray["errorinfo0"]		= $sqlcmd_Zugliste->errorInfo()[0];
	$responsearray["errorinfo1"]		= $sqlcmd_Zugliste->errorInfo()[1];
	$responsearray["errorinfo2"]		= $sqlcmd_Zugliste->errorInfo()[2];

	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaSpeichern') {

  $level      = $_POST['level'];
  $parentid   = $_POST['parentid'];
  $neuername  = $_POST['neuername'];

  $neuerlevel = intval($level) + 1; // neue Themen werden immer unter den bisherigen Knoten einsortiert

  $sqlcmd_Thema = $pdo->prepare("INSERT INTO T_Themen (level, parent, thematext) VALUES (?, ?, ?)");
  if($sqlcmd_Thema->execute(array($neuerlevel, $parentid, $neuername))) {

		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Thema erfolgreich eingetragen";	
		$responsearray["neueid"]				= $pdo->lastInsertId();;	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_Thema->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_Thema->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_Thema->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_Thema->errorInfo()[2];

	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaEntfernen') {

  $sqlcmd_Thema = $pdo->prepare("DELETE FROM T_Themen WHERE Id = " . $_POST['knotenid']);
  if($sqlcmd_Thema->execute()) {

		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Thema erfolgreich entfernt";	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_Thema->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_Thema->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_Thema->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_Thema->errorInfo()[2];

	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeVerbinden') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];
  
  $sqlcmd_ThemaUndAufgabe = $pdo->prepare("INSERT INTO T_ThemenAufgaben (ThemenID,  AufgabenID) VALUES (?, ? )");
  if($sqlcmd_ThemaUndAufgabe->execute(array($ThemaKennung, $AufgabeKennung))) {

		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Thema und Aufgabe erfolgreich kombiniert";	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_ThemaUndAufgabe->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[2];

	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeTrennen') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];
  
  $sqlcmd_ThemaUndAufgabe = $pdo->prepare("DELETE FROM T_ThemenAufgaben WHERE ThemenID = :themenid AND AufgabenID = :aufgabenid");
  if($sqlcmd_ThemaUndAufgabe->execute(array('themenid' => intval($ThemaKennung), 'aufgabenid' =>  intval($AufgabeKennung)))) {


		$responsearray["ergebnisflag"]	= true;
		$responsearray["ergebnistext"]	= "Thema und Aufgabe erfolgreich getrennt";	
  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten"; 
  }

	$responsearray["sql"]					= $sqlcmd_ThemaUndAufgabe->queryString;
	$responsearray["errorinfo0"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[0];
	$responsearray["errorinfo1"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[1];
	$responsearray["errorinfo2"]	= $sqlcmd_ThemaUndAufgabe->errorInfo()[2];

	echo json_encode($responsearray);
} 
?>