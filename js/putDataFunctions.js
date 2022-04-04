
function ThemaSpeichern(KnotenObj, NeuerName) {

  $.ajax({
    url:			"php/putDBData.php",
    type:			"POST",
    dataType:	"text",
    data:			{ dataContext: "ThemaSpeichern",             
                  level:      $('#'+KnotenObj.id).attr('level'),
                  parentid:   KnotenObj.id.split('_')[1],
                  neuername:  NeuerName
              },
		success:	function(responseData) {ThemaSpeichernErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
  })
}

function AufgabeSpeichern() {

	if($('#QuelleImport').val().includes("https://lichess.org/study/")) {
    var quelledetails = $('#QuelleImport').val().split("/");
    lichess_studie    = quelledetails[4];
    lichess_kapitel   = quelledetails[5];
	} else {
    lichess_studie    = "";
    lichess_kapitel   = "";
	}

	$.ajax({
		url:			"php/putDBData.php",
		type:			"POST",
		dataType:	"text",
		data:			{ dataContext:  "AufgabeSpeichern",             
                    Kurztext:     $('#KurztextImport').val(),
                    Langtext:     $('#LangtextImport').val(),
                    Quelle:       $('#QuelleImport').val(),
                    Quelledetail: $('#QuelledetailImport').val(),
                    ImportQuelle: $('#ImportQuelleImport').val(),
                    AmZug:        $('#AmZugImport').val(),
                    FEN:          $('#FENImport').val(),
                    Scope:        $('#ScopeImport').val(),
                    Skill:        $('#SkillImport').val(),
                    studie:       lichess_studie,
                    kapitel:      lichess_kapitel,
                    pgn:          T_Aufgabe.PGN
              },
		success:	function(responseData) {AufgabeSpeichernErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
	});

};
function ThemaUndAufgabeVerbinden(T_id, A_id) {

  $.ajax({
		url:			"php/putDBData.php",
		type:			"POST",
		dataType:	"text",
		data: 		{ dataContext: "ThemaUndAufgabeVerbinden",             
              	themakennung:   T_id,
                aufgabekennung: A_id
              },
		success:	function(responseData) {ThemaUndAufgabeErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
  });
}
function ThemaUndAufgabeTrennen(T_id, A_id) {

	$.ajax({
		url:			"php/putDBData.php",
		type:			"POST",
		dataType:	"text",
		data:			{ dataContext: "ThemaUndAufgabeTrennen",             
								themakennung:   T_id,
								aufgabekennung: A_id
							},
		success:	function(responseData) {ThemaUndAufgabeErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
  });
}

function ThemaEntfernen(KnotenId) {

	$.ajax({
		url:			"php/putDBData.php",
		type:			"POST",
		dataType:	"text",
		data:			{ dataContext:  "ThemaEntfernen",             
								knotenid:     KnotenId
							},
		success:	function(responseData) {ThemaEntfernenErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
  });
}
function AufgabeEntfernen(id) {
  
	$.ajax({
		url:			"php/putDBData.php",
		type:			"POST",
		dataType:	"text",
		data:			{ dataContext: "AufgabeEntfernen",             
								AufgabeID:      id
							},
		success:	function(responseData) {AufgabeEntfernenErfolg(responseData);},
		error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
  });
}

function ThemaSpeichernErfolg(responseData) {
  // alert(responseData);
  // var nodesdummy1 = $('#ThemenlisteTree').jstree(true).get_json('#', { flat: true })
  // $('#ThemenlisteTree').jstree(true).destroy();
  // getThemes();
  // var nodesdummy2 = $('#ThemenlisteTree').jstree(true).get_json('#', { flat: true })

  var neuerlevel = parseInt(KnotenObj.id.split('_')[0]) + 1;
	var Antwort = jQuery.parseJSON(responseData); 

	if(Antwort.ergebnisflag) {

		var NeuesThemaId = parseInt(Antwort.neueid);

		$('#ThemenlisteTree').jstree(true).create_node(
			KnotenObj.id,
			{
				"id":				'T_' + NeuesThemaId,
				"text":			neuerthemaname,
				"li_attr":	{ "level": neuerlevel }
			}, 
			"last", 
			function() { $('#ThemenlisteTree').jstree(true).open_node(KnotenObj.id)}
		);

		showFinishDialog(Antwort);
	} else {
		showDBErrorMessagesDialog(Antwort);
	}
}
function AufgabeSpeichernErfolg(responseData) {   
  
	var Antwort = jQuery.parseJSON(responseData); 
	NeueAufgabeID = parseInt(Antwort.neueid);

	getChallenges(ALLEAUFGABENANZEIGEN);

	if(NeueAufgabeID > 0) {

		console.table(Zugliste);
		console.log(JSON.stringify(Zugliste));

		$.ajax({
			url:			"php/putDBData.php",
			type:			"POST",
			dataType:	"text",
      data:			{ dataContext:	"Zugliste", 
									AufgabenID:		NeueAufgabeID, 
									Zugliste:	Zugliste 
								},
			success:	function(responseData) {ZuglisteErfolg(responseData);},
			error:		function (jqXHR, textStatus, errorThrown) { AjaxErrorFunction(jqXHR, textStatus, errorThrown); }  
		});
  }
};
function ThemaEntfernenErfolg(responseData) {

	var Antwort = jQuery.parseJSON(responseData); 

	if(Antwort.ergebnisflag) {
		$('#ThemenlisteTree').jstree(true).delete_node(KnotenObj);
	} else {
		showDBErrorMessagesDialog(Antwort);
	}
}
function AufgabeEntfernenErfolg(responseData) {   
  
	var Antwort = jQuery.parseJSON(responseData); 

	if(Antwort.ergebnisflag) {
		getChallenges(ALLEAUFGABENANZEIGEN);
	} else {
		showDBErrorMessagesDialog(Antwort);
	}  
};
function ThemaUndAufgabeErfolg(responseData) {

	var Antwort = jQuery.parseJSON(responseData); 

	if(Antwort.ergebnisflag) {
		alert("Thema und Aufgabe erledigt");
	} else {
		showDBErrorMessagesDialog(Antwort);
	}
}
function ZuglisteErfolg(responseData) {

	var Antwort = jQuery.parseJSON(responseData); 

	if(Antwort.ergebnisflag) {
		var Zuganzahl = parseInt((/\d+ Züge erfolgreich neu kombiniert./g).exec(responseData));
		alert("Die neue Aufgabe wurde übernommen");
	} else {
		showDBErrorMessagesDialog(Antwort);
	}
}

//function responseDatadone(responseData)   {   alert('responseDatadone mit ' + responseData);  };
function responseDatafail(responseData)   {   alert('responseDatafail mit ' + responseData);  };
function responseDataalways(responseData) {   alert('responseDataalways mit ' + responseData);  };

function AjaxErrorFunction(jqXHR, textStatus, errorThrown) {
  alert('Errorfunction');
}
