function IAmTouched(evx) {
    alert('IAmTouched');
    console.log(event);
    //alert(evx.targetTouches); 
}

// Als Funktion implementiert. Eventlistener waren nicht möglich, weil jquery die Tags nicht selektiert hat
// Grundlage ist ein Beispiel für Treeviews bei w3schools
function toggle_ul(itemID) {

	 $('#' + itemID)[0].parentElement.querySelector(".nested").classList.toggle("active");
	 $('#' + itemID)[0].classList.toggle("caret-down");
}

function NeuesThema() {
    
    if($('#ThemenlisteTree').jstree().get_selected(true).length == 0) {
        alert("Bitte vorher ein Thema auswählen");
        return;
    }
    else {
        KnotenObj = $('#ThemenlisteTree').jstree().get_selected(true)[0];
        Knoten = $('#ThemenlisteTree').jstree().get_selected(true)[0].id.split('_');
    }
    
    NeuesThemaDialog = $( "#dialog_neuesthema" ).dialog({
        title: "Neues Thema",
        height: 250,
        width: 600,
        modal: true,
        open: function () {
            $( "#dialog_neuesthema" ).append('<img src="Bilder/WhiteQueen.png" alt="" class="imgfigur">');
            $( "#dialog_neuesthema" ).append('<p><span id="parentnode"></span> ergänzen mit&nbsp;&nbsp;<input type="text" name="Themaname" id = "Themaname"></p>');
            $('#parentnode').html(KnotenObj.text); // Ist sicher ungleich null
						$('#Themaname').focus();
        },
        buttons: [
            {
                id:     'NeuesThemaOK',
                text:   'Ok',
                click:  function() {
                    if($('#Themaname').val() != "") {
                            neuerthemaname = $('#Themaname').val();
                            ThemaSpeichern(KnotenObj, neuerthemaname);
                            $(this).dialog('close');
                            $( "#dialog_neuesthema" ).empty();
                        } else {
                            alert("Neues Thema ohne Name nicht möglich");
                        }
                    }
            },
            {
                id:     'NeuesThemaAbbrechen',
                text:   'Abbrechen',
                click:  function() {
                            $( "#dialog_neuesthema" ).empty();
                            NeuesThemaDialog.dialog('close');
                        }
            }
        ]
    });
}

function VerbindeAufgabe() {

    var ThemaKnotenObj  = $('#ThemenlisteTree').jstree().get_selected(true);
    var Aufgabetext     = $( "#ul_Aufgabenliste li.ui-selected" );

    if(ThemaKnotenObj.length == 0 || Aufgabetext.length == 0) {
        alert('Bitte vorher sowohl Thema als auch Aufgabe auswählen');
        return;
    }

    AufgabeVerbindenDialog = $( "#dialog_AufgabeVerbinden" ).dialog({
        title: "Aufgabe und Thema kombinieren",
        height: 300,
        width: 600,
        modal: true,
        open: function () {
            $('#dialog_AufgabeVerbinden').html('Die Aufgabe ' + Aufgabetext[0].innerText + ' und das Thema ' + ThemaKnotenObj[0].text + ' werden kombiniert'); // Ist sicher ungleich null
        },
        buttons: [
            {
                id:     'VerbindeAufgabeOK',
                text:   'Ok',
                click:  function() {
                            ThemaUndAufgabeVerbinden(ThemaKnotenObj[0].id.split('_')[1], Aufgabetext[0].id);
                            $( "#dialog_AufgabeVerbinden" ).empty();
                            $(this).dialog('close');
                        }
            },
            {
                id:     'VerbindeAufgabeAbbrechen',
                text:   'Abbrechen',
                click:  function() {
                            $( "#dialog_AufgabeVerbinden" ).empty();
                            $(this).dialog('close');
                        }
            }
        ]
    });
}
function TrenneAufgabe() {

    ThemaKnotenObj = $('#ThemenlisteTree').jstree().get_selected(true); 
    Aufgabetext = $( "#ul_Aufgabenliste li.ui-selected" );

    AufgabeTrennenDialog = $( "#dialog_AufgabeTrennen" ).dialog({
        title: "Aufgabe und Thema trennen",
        height: 300,
        width: 600,
        modal: true,
        open: function () {
            $('#dialog_AufgabeTrennen').html('Die Aufgabe ' + Aufgabetext[0].innerText + ' und das Thema ' + ThemaKnotenObj[0].text + ' werden getrennt'); // Ist sicher ungleich null
        },
        buttons: {
            Ok: function() {
                ThemaUndAufgabeTrennen(ThemaKnotenObj[0].id.split('_')[1], Aufgabetext[0].id);
                $( "#dialog_AufgabeTrennen" ).empty();
                $(this).dialog('close');
            },
            Abbrechen: function() {
                $( "#dialog_AufgabeTrennen" ).empty();
                $(this).dialog('close');
            }
        }
    });
}

function EntferneThema() {

    KnotenObj = $('#ThemenlisteTree').jstree(true).get_selected(true);

    if(KnotenObj.length == 0) { 
        alert("Bitte vorher ein Thema auswählen");
        return;
    } else if (KnotenObj[0].id.startsWith('0')) {
        alert("Dieses Thema darf nicht entfernt werden");
        return;
    } else if(!$('#ThemenlisteTree').jstree(true).is_leaf(KnotenObj[0])) { // Man beachte das Ausrufezeichen
        alert('Zur Zeit dürfen nur Themen ohne nachgeordnete Themen entfernt werden');
				return;
    }

    ThemaEntfernenDialog = $( "#dialog_themaentfernen" ).dialog({
        title: "Thema entfernen",
        height: 250,
        width: 700,
        modal: true,
        open: function () {
            $( "#dialog_themaentfernen" ).append('<img src="Bilder/WhiteQueen.png" alt="" class="imgfigur">');
            $( "#dialog_themaentfernen" ).append('<p><span id="Themanodename"></span> wirklich entfernen?</p>');
            $('#Themanodename').html(KnotenObj[0].text); 
        },
        buttons: {
            Ok: function() {
                ThemaEntfernen(KnotenObj[0].id.split('_')[1]);
                $(this).dialog('close');
                $( "#dialog_themaentfernen" ).empty();
                ThemaEntfernenDialog.dialog('close');
            },
            Abbrechen: function() {
                    $( "#dialog_themaentfernen" ).empty();
                    ThemaEntfernenDialog.dialog('close');
            }
        }
    });
}
function EntferneAufgabe() {

    if($( "#ul_Aufgabenliste li.ui-selected" ).length == 0) {
        alert("Bitte vorher eine Aufgabe auswählen");
        return;
    }

    isChallengeUsed($( "#ul_Aufgabenliste li.ui-selected" )[0].id).then(function(isChallengeUsedResult) {
        console.log('resolve isChallengeUsedResult: ' + isChallengeUsedResult);

        if(isChallengeUsedResult == true) {
            alert("Bitte vorher die Verbindungen zu den Themen entfernen");
            return;
        } else {
            AufgabeID = $( "#ul_Aufgabenliste li.ui-selected" )[0].id;
            AugabeEntfernenDialog = $( "#dialog_AufgabeEntfernen" ).dialog({
                    title: "Thema entfernen",
                    height: 250,
                    width: 700,
                    modal: true,
                    open: function () {
                        $( "#dialog_AufgabeEntfernen" ).append('<img src="Bilder/WhiteQueen.png" alt="" class="imgfigur">');
                        $( "#dialog_AufgabeEntfernen" ).append('<p><span id="Aufgabenodename"></span> wirklich entfernen?</p>');
                        $('#Aufgabenodename').html($( "#ul_Aufgabenliste li.ui-selected" )[0].innerText); 
                    },
                    buttons: {
                        Ok: function() {
                            AufgabeEntfernen(AufgabeID);
                            $(this).dialog('close');
                            $( "#dialog_AufgabeEntfernen" ).empty();
                            AugabeEntfernenDialog.dialog('close');
                        },
                        Abbrechen: function() {
                                $( "#dialog_AufgabeEntfernen" ).empty();
                                AugabeEntfernenDialog.dialog('close');
                        }
                    }
            });
        }

    }).catch(function(errdata) {
        console.log('reject isChallengeUsedResult: ' + isChallengeUsedResult);
 
    });
    
}

function toggleEnginelog(CheckboxID) {
    console.log('toggleEnginelog');

    if($('#' + CheckboxID).is( ":checked" )) {
        GlobalEnginelogActive =  true;
 
        EnginelogDialog = $( "#dialog_Enginelog" ).dialog({
            title: "Enginelog",
            height: 800,
            width: 1000,
            modal: false,
            position: { my: "left top", at: "left top", of: "#ThemenlisteTree" },
            open: function() {  console.log('open Enginelog');  },
            close: function( event, ui ) {
                console.log('close in close');
                GlobalEnginelogActive = false;
                $( "#" + CheckboxID).prop( "checked", false );
            }
        });

    } else {
        console.log('close per checkbox');
        GlobalEnginelogActive =  false;
        $( "#dialog_Enginelog" ).dialog('close');
    }
   
}
function toggleEnginelogEin() {
    $('.LogEin').toggle();
}
function toggleEnginelogAus() { 
    $('.LogAus').toggle();
}

// Das war eine Fundstelle im Netz
function handleFileSelect (e) {
    var files = e.target.files;
    if (files.length < 1) {
        alert('select a file...');
        return;
    }
    var file = files[0];
    var reader = new FileReader();
    //reader.onload = onFileLoaded;
    reader.onloadend = onFileLoadedend;
    reader.readAsText(file);
    $('#filenametext').html(file.name);

    var x = reader.result;
    var i = 0;
}

function onFileLoaded (e) {
    var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
    if (match == null) {
        throw 'Could not parse result'; // should not happen
    }
    var mimeType = match[1];
    var content = match[2];
    alert(mimeType);
    alert(content);
}

function onFileLoadedend (e) { 
    
    document.getElementById("ImportAreaText").innerHTML = e.target.result;

    prepareImportedData();
}
function prepareImportedData() {

    $('#ul_importaufgaben').empty();
    $('#ScrollWrapperImport').empty().append('<div id="TreeNotationslisteImport"></div>');
    BrettLeeren('Brett_ImportAufgabe');

    GlobalImportedPGN = document.getElementById("ImportAreaText").innerHTML.split("\n\n\n");

    console.log(document.getElementById("ImportAreaText").innerHTML);

    for(i = 0; i < GlobalImportedPGN.length; i++) {
        var aufgabetext = (/(\[Event \")(?<event>.*)(?<![\"\]])/g).exec(GlobalImportedPGN[i]);
        if(aufgabetext != null) {
            var newitem = '<li id="importedpgn_' + i + '">' + aufgabetext.groups.event + '</li>';
            $(newitem).appendTo('#ul_importaufgaben'); 
        }
    }

    $( "#ul_importaufgaben" ).selectable({
        selected: function( event, ui ) {

            GlobalImportedPGNIndex = ui.selected.id.split("_")[1];
            scanMetaData(GlobalImportedPGN[GlobalImportedPGNIndex]);	
            StellungAufbauen("Brett_ImportAufgabe", T_Aufgabe.FEN, 'zugmarkerimport');

            $('#ScrollWrapperImport').empty()
            .append('<div id="TreeNotationslisteImport"></div>');
    
            document.getElementById("ImportAreaText").innerHTML = GlobalImportedPGN[GlobalImportedPGNIndex];
        }
    });
}

function KommandoAbschicken() {

    $("#TriggerTag").trigger("gocmd", Kommandostart.value );

}

function RegexAbschicken() {


    var m_depth = (/(depth )(?<depth>\d)/g).exec(Regexstart.value);
    var m_seldepth = (/(seldepth )(?<seldepth>\d)/g).exec(Regexstart.value);

    var m_scorecp = (/(score cp )(?<scorecp>\d)/g).exec(Regexstart.value);

    var i = 0;

}

function playermovecontinue() {

    GlobalActionStep = AS_FINISHPLAYERMOVE;
    postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
    postit('d'); 

}

// Bei der Zugnotation für stockfish fehlt der Figurname.
// Der wird hier über FEN bestimmt: aus dem Feldname ergibt sich ein "Index" in FEN
function getMoveNotations(FEN, sfmove, result) {
    
    console.log('FEN: ' + FEN + ' sfmove: ' + sfmove + ' result: ' + result);

    var FileVon  = sfmove.substr(0,1);
    var RankVon  = sfmove.substr(1,1);
    var FileNach = sfmove.substr(2,1);
    var RankNach = sfmove.substr(3,1); 
    var PawnPromotion = sfmove.length == 5 ? FIGURNOTATION[sfmove.substr(4,1)] : '';

    var FENohne = FEN.replaceAll('/', '');
    
    var IndexVon    = FENFileFactor[FileVon] + FENFileFactor[RankVon] * 8;
    var idxVon      = 0;
    var FENFigurVon = "";

    var returnresult = '';

    for (i = 0; i < FEN.length; i++) { 

        if($.isNumeric(FENohne[i])) 
            idxVon += parseInt(FENohne[i]); // Bei Leerfeldern (=Zahlen) die Anzahl dazu
        else 
            idxVon++; // Bei Figuren oder Bauern (ungleich Zahlen) inkrementieren

        if(idxVon == IndexVon) { // Muss echt gleich sein. > wäre fehlhaft, weil dann das Feld leer wäre
            FENFigurVon = FENohne[i];
            break;
        }
    }
 
    var IndexNach    = FENFileFactor[FileNach] + FENFileFactor[RankNach] * 8;
    var idxNach      = 0;
    var FENFigurNach = "";

    for (i = 0; i < FEN.length; i++) { 


        if($.isNumeric(FENohne[i])) 
            idxNach += parseInt(FENohne[i]); // Bei Leerfeldern (=Zahlen) die Anzahl dazu
        else 
            idxNach++; // Bei Figuren oder Bauern (ungleich Zahlen) inkrementieren

        if(idxNach >= IndexNach) { // muss nicht gleich sein. Durch Leerfelder kann der Index größer werden
            // Wenn an der Stelle eine Zahl steht, ist das Feld leer
            FENFigurNach = $.isNumeric(FENohne[i]) ? "" : FENohne[i];
            break;
        }

    }
     
    if(FENFigurVon.toUpperCase() == "P") { // Die Zeichenkette für einen Bauer zusammenbauen

        if(FENFigurNach == "")  // Dann hat ein Bauer nur gezogen und nicht geschlagen
            ZugErgebnis = FileNach + RankNach;
         else 
            ZugErgebnis = FileVon + SCHLÄGT + FileNach + RankNach;
 
    } else { // Die Zeichenkette für eine Figur
        if(FENFigurNach == "")  // Dann hat die Figur nur gezogen und nicht geschlagen
            ZugErgebnis = FIGURNOTATION[FENFigurVon] + FileNach + RankNach;
         else 
            ZugErgebnis = FIGURNOTATION[FENFigurVon] + SCHLÄGT + FileNach + RankNach;
    }

    switch(result) {
        case 'kurz':
            returnresult = ZugErgebnis + PawnPromotion; 
            break;
        case 'FigurVon':
            returnresult = FENFigurVon;
            break;
        default:
            returnresult = '';
            break;                                
    }    

    return returnresult;
}

// function setSpielinteraktion(RadioValue) {

//     GlobalActionContext = RadioValue;

//     showapproachGeorg(GlobalAufgabeId);

// }

function Aufgabeauswahl() {

    if($('#btn_Aufgabeauswahl').html() == "Alle Aufgaben anzeigen") {
        GlobalThemaId = ALLEAUFGABENANZEIGEN; 
        $('#btn_Aufgabeauswahl').html("Aufgaben nur zu einem Thema anzeigen")
    } else {
        if($('#ThemenlisteTree').jstree().get_selected(true).length > 0) {
            GlobalThemaId = $('#ThemenlisteTree').jstree().get_selected(true)[0].li_attr["data-themaid"]
        } else {
            GlobalThemaId = THEMA0AUFGABENANZEIGEN;
        }
        $('#btn_Aufgabeauswahl').html("Alle Aufgaben anzeigen")
    }
    getChallenges(GlobalThemaId)
}

// Weil der debugger nicht auf Mausklick im Schachbrett reagiert
function startMouseUp() {

    T_Zuege.ZugVon      = $('#Mausersatz').val().slice(0,2);
    T_Zuege.ZugFigur    = $( "span[id$='" + $('#Mausersatz').val().slice(0,2) + "']" )[0].id.slice(0,1);

    T_Zuege.ZugNach = $('#Mausersatz').val().slice(-2);

    console.log('firePlayerMove1');
    firePlayerMove();
    console.log('firePlayerMove2');
}

function firePlayerMove() { 

    T_Zuege.ZugAktion       = ""; // später
    T_Zuege.ZugZeichen      = ""; // später oder nie

    // Hier fehlt noch ein Dialog für den gewünschten Figurenname. Als Einfachlösung: immer in eine Dame umwandeln
    if(T_Zuege.ZugFigur.toUpperCase() == 'P' && (T_Zuege.ZugNach.slice(-1) == '1' || T_Zuege.ZugNach.slice(-1) == '8')) {
        T_Zuege.ZugUmwandlung   = T_Zuege.ZugFarbe == WEISSAMZUG ? 'Q' : 'q';
    } else {
        T_Zuege.ZugUmwandlung   = "";
    }

    // Rochaden kodieren
    if(T_Zuege.ZugFigur.toUpperCase() == 'K' && (T_Zuege.ZugVon.substr(0, 1) == 'e' && T_Zuege.ZugNach.substr(0, 1) == 'g')) {
        T_Zuege.ZugKurz = '0-0';
    } else if(T_Zuege.ZugFigur.toUpperCase() == 'K' && (T_Zuege.ZugVon.substr(0, 1) == 'e' && T_Zuege.ZugNach.substr(01, 1) == 'c')) {
        T_Zuege.ZugKurz = '0-0-0';
    } else {
        T_Zuege.ZugKurz = FIGURNOTATION[T_Zuege.ZugFigur] + T_Zuege.ZugNach;
    }

    T_Zuege.ZugStockfish = T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase(); 

    T_Zuege_undo = Object.assign({}, T_Zuege);
    
    PlayerScores    = [];
    EngineScores    = [];
    Playerwdl       = [];
    Enginewdl       = [];
   switch (GlobalActionContext) {
        case AC_CHALLENGE_PLAY:
            GlobalActionStep = AS_CHECKCHALLENGEMOVE;
            $("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );
            $("#TriggerTag").trigger("isMoveCorrect", [ T_Zuege.ZugStockfish /* + T_Zuege.ZugUmwandlung */ ] );
            break;
        case AC_CHALLENGE_RATING:
            GlobalActionStep = AS_PREPAREMOVE;
            $("#TriggerTag").trigger("UciNewGame");
            $("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ]);
            $("#TriggerTag").trigger("validateMove", [ T_Zuege.ZugStockfish /* + T_Zuege.ZugUmwandlung */ ]);
            break;
        case AC_CHALLENGE_Varianten:

            PlayapproachGeorg();
            //PlayChallengeVarianten();
            break;
        default:
            GlobalActionStep = AS_PREPAREMOVE;
            break;                                
    }    

}

function showChallengeTip(text) {
$('#ChallengeTips').empty().append('<p>' + text + '</p>');
}

function getFuncName() {
    return getFuncName.caller.name
 }