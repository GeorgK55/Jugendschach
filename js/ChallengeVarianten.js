

function PlayChallengeVarianten() { 

    console.log('PlayChallengeVarianten'); // Anfang

    ExpectedPlayerMove  = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId; })[0];
 
    // Auslöser war ja ein manueller Zug auf dem Brett. Die stehen immer in T_Zuege
    // Hier erst mal eine vereinfachte Interpretation der Variantenanalyse: 
    // ein Zug, der nicht vorgesehen ist, ist falsch
    // da alle erlaubten Züge schon in der Datenbank stehen und damit verifiziert sind, wird die Engine gar nicht benötigt
    // der Vergleich in der stockfish-Syntax ist besonders einfach 
    if (T_Zuege.ZugStockfish != ExpectedPlayerMove.ZugStockfish) { // wirkt wie return, da der gesamte Rest im else steckt
        EnginezugDialog = $( "#dialog_BessererZug" ).dialog({
            title: "Falscher Zug",
            height: 400,
            width: 600,
            modal: true,
            open: function () {
                $('#VariantenSpielerzug').html(T_Zuege.ZugFigur + T_Zuege.ZugNach);
                $('#VariantenZugvorschlag').empty();
                $('#Zugbewertung').empty();
            },
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        });
    } else {

        // Der manuelle Zug ist der erwartete Zug und wird auf dem Brett ausgeführt
        ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

        // Der Zug wird als Vorbereitung für die Notation in die Situtionsdaten geschrieben
        Stellungsdaten.ZugNummer = ExpectedPlayerMove.ZugNummer
        if (ExpectedPlayerMove.ZugFarbe == WEISSAMZUG) { 
            Stellungsdaten.Text_w = ExpectedPlayerMove.ZugKurz;
            Stellungsdaten.Text_b = DefaultMove_b;
            Stellungsdaten.FEN_w  = ExpectedPlayerMove.FEN;
            Stellungsdaten.FEN_b  = "&nbsp;";
        } else {
            Stellungsdaten.Text_b = ExpectedPlayerMove.ZugKurz;
            Stellungsdaten.Text_w = DefaultMove_w;
            Stellungsdaten.FEN_b  = ExpectedPlayerMove.FEN;
            Stellungsdaten.FEN_w  = "&nbsp;";
        }

        // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
        // Sonst wird die Notationszeile aktualisiert
        if (ExpectedPlayerMove.ZugFarbe == WEISSAMZUG || addNotationlineFlag) {
            Stellungsdaten.CurNodeId = NodePräfix + ExpectedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
            Stellungsdaten.CurMoveId = ExpectedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
            NewTreeNode('TreeNotationslistePlayChallenge', Stellungsdaten, ExpectedPlayerMove, true);
            addNotationlineFlag = false;
        } else {
            UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, ExpectedPlayerMove, true);
        }

        // Suchen nach ALLEN Folgezügen
        VariantenCandidates = $.grep(ChallengeMoves, function(PMI, i) { 
            return PMI['PreMoveId'] == ExpectedPlayerMove.CurMoveId;
        });

        // Wenn Varianten gefunden wurden
        // Jetzt erst mal die Einschränkung auf eine Variante als Zwischenlösung
        if(VariantenCandidates.length > 0) {

            VariantenId = VariantenCandidates[0].Id; // Um mehrere Varianten gegeneinander abzugrenzen. Kommt eventuell später oder vielleicht auch gar nicht.

            ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
                title: "Variante spielen",
                height: 250,
                width: 400,
                modal: true,
                open: function () {
                    $("#ChallengeVarianteStartZug").html(VariantenCandidates[0].ZugKurz);
                },
                buttons: [
                    {
                        id:     'VarianteSpielen',
                        text:   'Spielen',
                        click:  function() {
                                    $( "#ChallengeVarianteStartZug" ).empty();
                                    ChallengeVariantestartDialog.dialog('close');
                                }
                    }
                    // ,
                    // {
                    //     id:     'VarianteAbbrechen',
                    //     text:   'Abbrechen',
                    //     click:  function() {
                    //                 $( "#ChallengeVarianteStartZug" ).empty();
                    //                 ChallengeVariantestartDialog.dialog('close');
                    //             }
                    // }
                ]
            });

            // Den "übergangenen" Zug markieren. Der verursachende Zug ist sicher schon in der Notation enthalten
            UpdateTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, ExpectedPlayerMove, true);

            // Die Situation VOR der Variante in den Stack
            Stellungsdaten.StellungsStack.push( { PreNode:      Stellungsdaten.PreNodeId, 
                                                  CurNode:      Stellungsdaten.CurNodeId, 
                                                  CurMove:      Stellungsdaten.CurMoveId, 
                                                  MoveIndex:    ExpectedPlayerMove.CurMoveIndex 
            });
            
            // Die neue Situation als aktuelle Situation merken
            Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            Stellungsdaten.CurNodeId = NodePräfix + VariantenCandidates[0].CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
            Stellungsdaten.CurMoveId = VariantenCandidates[0].CurMoveId;

            if (VariantenCandidates[0].ZugFarbe == WEISSAMZUG) { 
                Stellungsdaten.Text_w = VariantenCandidates[0].ZugKurz;
                Stellungsdaten.Text_b = DefaultMove_b;
                Stellungsdaten.FEN_w  = ExpectedPlayerMove.FEN;
                Stellungsdaten.FEN_b  = "&nbsp;";
            } else {
                Stellungsdaten.Text_b = VariantenCandidates[0].ZugKurz;
                Stellungsdaten.Text_w = DefaultMove_w;
                Stellungsdaten.FEN_b  = ExpectedPlayerMove.FEN;
                Stellungsdaten.FEN_w  = "&nbsp;";
            }

            // Der Zug der Variante wird auf dem Brett ausgeführt
            ZieheZug(VariantenCandidates[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

            // Den Zug in die Notationsliste eintragen
            // Beim Beginn einer Variante wird immer eine neue Zeile generiert
            NewTreeNode('TreeNotationslistePlayChallenge', Stellungsdaten, VariantenCandidates[0], true);
        
        } else { // else heißt hier: es ist ein Zug ohne Varianten oder es ist eine Variante zu Ende oder die Aufgabe ist zu Ende

            FindNextMove(Stellungsdaten);
        }
        // Zug spielen und notieren 
    }
}

function FindNextMove(Stellungsdaten) {

     //  Sucht einen Zug auf der gleichen Ebene. Es kann nur einen oder keinen geben
    //NextOppenentMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == ExpectedPlayerMove.CurMoveId && parseInt(PMI['ZugLevel']) == parseInt(ExpectedPlayerMove.ZugLevel); });
    NextOppenentMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId && parseInt(PMI['ZugLevel']) == Stellungsdaten.StellungsStack.length; });

    if(NextOppenentMove.length == 0) { 

        if (Stellungsdaten.StellungsStack.length == 0) {
            $('#ChallengeTips').append('<span>Damit ist die Aufgabe erfolgreich gelöst</span>');
            return;
        } else {
            $('#ChallengeTips').append('<span>Damit ist die Variante beendet</span>');

            // Zurück vor die eben beendete Variante
            PreMove = Stellungsdaten.StellungsStack.pop();
            Stellungsdaten.PreNodeId    = PreMove.PreNode;
            Stellungsdaten.CurNodeId    = PreMove.CurNode;
            Stellungsdaten.MoveId       = PreMove.CurMove;

        }
    }

    Fertig  = false;
    counter = 0; // Nur zur Vermeidung einer Endlosschleife

    while (NextOppenentMove.length != 1 && !Fertig && counter < 10) {

        // Zurück vor die eben beendete Variante
        PreMove = Stellungsdaten.StellungsStack.pop();
        Stellungsdaten.PreNodId   = PreMove.PreNode;
        Stellungsdaten.CurNodeId   = PreMove.CurNode;
        Stellungsdaten.MoveId   = PreMove.CurMove;

        // Statt Stellungsdaten.StellungsStack.length eine Variable einbauen ?!
        NextOppenentMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId && parseInt(PMI['ZugLevel']) == Stellungsdaten.StellungsStack.length; });

        if (NextOppenentMove.length == 1) { // Ein Passender Zug gefunden?
            
            //alert('Jetzt ist die Variante VariantenCandidates[0].ZugKurz beendet.Ich spiele jetzt den Zug ' + NextOppenentMove[0].ZugKurz);
            ChallengeVarianteendeDialog = $( "#dialog_ChallengeVarianteEnde" ).dialog({
                title: "Variante beendet",
                height: 250,
                width: 400,
                modal: true,
                open: function () {
                    //$( "#ChallengeVarianteEndeZug" ).html(VariantenCandidates[0].ZugKurz);
                    $( "#ChallengeWeiterZug" ).html(NextOppenentMove[0].ZugKurz);
                },
                buttons: [
                    {
                        id:     'VarianteSpielen',
                        text:   'Weiter',
                        click:  function() {
                                    $( "#ChallengeVarianteEndeZug" ).empty();
                                    $( "#ChallengeWeiterZug" ).empty();
                                    ChallengeVarianteendeDialog.dialog('close');
                                }
                    }
                    // ,
                    // {
                    //     id: 'VarianteAbbrechen',
                    //     text: 'Abbrechen',
                    //     click: function () {
                    //         $("#ChallengeVarianteEndeZug").empty();
                    //         $("#ChallengeWeiterZug").empty();
                    //         ChallengeVarianteendeDialog.dialog('close');
                    //     }
                    // }
                ]
            });

            StellungAufbauen("Brett_SpieleAufgabe", NextOppenentMove[0].FEN, 'zugmarkerimport');
            Fertig = true; 
        }
        counter++;
    } 

    ZieheZug(NextOppenentMove[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

    // Der Zug wird für die Notation in die Stellungsdaten geschrieben
    Stellungsdaten.ZugNummer   = NextOppenentMove[0].ZugNummer
    if (NextOppenentMove[0].ZugFarbe == WEISSAMZUG) { 
        Stellungsdaten.Text_w  = NextOppenentMove[0].ZugKurz;
        Stellungsdaten.Text_b  = DefaultMove_b;
        Stellungsdaten.FEN_w   = NextOppenentMove[0].FEN;
        Stellungsdaten.FEN_b   = "&nbsp;";
    } else {
        Stellungsdaten.Text_b  = NextOppenentMove[0].ZugKurz;
        Stellungsdaten.Text_w  = DefaultMove_w;
        Stellungsdaten.FEN_b   = NextOppenentMove[0].FEN;
        Stellungsdaten.FEN_w   = "&nbsp;";;
    }

    // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
    // Sonst wird die Notationszeile aktualisiert
    if (NextOppenentMove[0].ZugFarbe == WEISSAMZUG || addNotationlineFlag) {
        Stellungsdaten.CurNodeId = NodePräfix + NextOppenentMove[0].CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
        Stellungsdaten.CurMoveId = NextOppenentMove[0].CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
        NewTreeNode('TreeNotationslistePlayChallenge', Stellungsdaten, NextOppenentMove[0], true);
    } else {
        UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, NextOppenentMove[0], true);
    }

    //UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, NextOppenentMove[0], true);

    // Auf den nächsten Zug einstellen
    Stellungsdaten.CurMoveId = NextOppenentMove[0].CurMoveId;

    NextPlayerMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId; })[0];
    if(NextPlayerMove === undefined) { // Wird nur bei Aufgabeende oder bei falscher PGN erreicht!
        if(Stellungsdaten.StellungsStack.length == 0) {
            $('#ChallengeTips').append('<span>Damit ist die Aufgabe erfolgreich gelöst</span>');
            return;   
        } else {
            // Zurück vor die nächste noch vefügbare Variante
            PreMove = Stellungsdaten.StellungsStack.pop();
            Stellungsdaten.PreNodeId   = PreMove.PreNode;
            Stellungsdaten.CurNodeId   = PreMove.CurNode;
            Stellungsdaten.CurMoveId   = PreMove.CurMove;

            NextPlayerMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId; })[0];
            ZieheZug(NextPlayerMove[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

            FindNextMove(Stellungsdaten)
        }
    }
}