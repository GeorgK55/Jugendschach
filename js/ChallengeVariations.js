function PlayChallengeVarianten() { 

    console.log('PlayChallengeVarianten');

    CurChallengeMove = 	$.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == ChallengeMoveId; })[0];


    if (T_Zuege.ZugStockfish != CurChallengeMove.ZugStockfish) {
        EnginezugDialog = $( "#dialog_Variantenzug" ).dialog({
            title: "Falscher Zug",
            height: 400,
            width: 600,
            modal: true,
            open: function () {
                $('#VariantenSpielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
                $('#VariantenZugvorschlag').html(ChallengeMoves[VariantenMovecounter].ZugKurz);
                $('#Zugbewertung').empty();
            },
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        });
    } else {

        ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        //SchreibeZug('NotationstabelleAufgabe');

        if (T_Zuege.ZugFarbe == WEISSAMZUG) {

            // Neue Zeile anlegen und dann die Voreinstellungen in die Notationsliste eintragen
            $('#TreeNotationslistePlayChallenge').jstree().create_node(VariantenDaten.PreNodeId, {
                "id": VariantenDaten.CurNodeId,
                "text": "<div><span class='movenumber'>" + CurChallengeMove.ZugNummer + "</span>"
                        + "<span class='movewhite' id='"
                        + CurChallengeMove.CurMoveId + WhitePostfix + "'>" + DefaultMove_w 
                        + "</span><span class='moveblack' id='"
                        + CurChallengeMove.CurMoveId + BlackPostfix + "'>" + DefaultMove_b
                        + "</span></div>"
            }, "last", function() {
            //alert("startnode created");
            });
            CurrentMove_w = DefaultMove_w;
            CurrentMove_b = DefaultMove_b;
        }

        if (/*line.substr(5).includes("w")*/ CurChallengeMove.ZugFarbe == WEISSAMZUG) { 
            CurrentMove_w = CurChallengeMove.ZugKurz;
        } else {
            CurrentMove_b = CurChallengeMove.ZugKurz;
        }

        //postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);

        //GlobalActionStep = AS_CV_DRAWVariantenMOVE;

        //postit('setoption name clear hash'); // Mai 2021 kommentiert
        //postit('go depth ' + Suchtiefe);
        //PlayChallengeVarianten();
    }

    $('#TreeNotationslistePlayChallenge').jstree().open_all();
    
    VariantenCandidates = $.grep(ChallengeMoves, function(PMI, i) { 
        return PMI['PreMoveId'] == CurChallengeMove.CurMoveId && PMI['ZugLevel'] > CurChallengeMove.ZugLevel; 
    });

    NextMainMove = $.grep(ChallengeMoves, function(PMI, i) { 
        return PMI['PreMoveId'] == CurChallengeMove.CurMoveId && PMI['ZugLevel'] == CurChallengeMove.ZugLevel; 
    });

    if(NextMainMove.length > 1) {
        alert('Mehrere Folgezüge gefunden');
        return;
    } else {

        //GlobalActionStep = AS_CV_VERIFYMOVE;
        //CurChallengeMove = NextMainMove[0];
        //$("#TriggerTag").trigger("SetFenPosition", [ CurChallengeMove.FEN ]);
        //$("#TriggerTag").trigger("validateMove", [ CurChallengeMove.ZugStockfish /* + T_Zuege.ZugUmwandlung */ ]);

        ZieheZug(NextMainMove[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        //SchreibeZug('NotationstabelleAufgabe');

        ChallengeMoveId = NextMainMove[0].CurMoveId;

        if (/*line.substr(5).includes("w")*/ NextMainMove[0].ZugFarbe == WEISSAMZUG) { 
            CurrentMove_w = NextMainMove[0].ZugKurz;
        } else {
            CurrentMove_b = NextMainMove[0].ZugKurz;
        }

        Zugnummer_span = "<span class='movenumber'>" + CurChallengeMove.ZugNummer + "</span>";
        NewNodeText_w = "<span class='movewhite' id='" + CurChallengeMove.CurMoveId + "_w'>" + CurrentMove_w + "</span>";
        NewNodeText_b = "<span class='moveblack' id='" + CurChallengeMove.CurMoveId + "_b'>" + CurrentMove_b + "</span>";

        sel = $('#TreeNotationslistePlayChallenge').jstree().get_node(VariantenDaten.CurNodeId);
        $('#TreeNotationslistePlayChallenge').jstree().edit(sel, "<div>" + Zugnummer_span + NewNodeText_w + NewNodeText_b + "</div>");
        VariantenDaten.PreNodeId = VariantenDaten.CurNodeId;
    }

    console.log(VariantenCandidates.length);
}