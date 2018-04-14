port module Main exposing (main)

import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (class)
import Time exposing (Time, second)


debugMessages : String -> Html Msg
debugMessages msg =
    div [ class "debug-messages" ] [ text msg ]


type alias Model =
    { debugMessage : String
    , gameOn : Bool
    , shownNote : String
    , shownNotes : List String
    , score : Int
    , scored : Bool
    , shownIndex : Int
    , inCountdown : Bool
    , countdown : Int
    , wrong : Bool
    , gameMode : String
    , tried : List String
    }


defaultModel : Model
defaultModel =
    { debugMessage = ""
    , gameOn = False
    , shownNote = ""
    , shownNotes = []
    , score = 0
    , scored = False
    , shownIndex = 0
    , inCountdown = False
    , countdown = 0
    , wrong = False
    , gameMode = "note"
    , tried = []
    }


type alias KeyEvent =
    { event : String
    , key : String
    }


type alias NotePressEvent =
    { note : Int
    , scaleNote : String
    }


type alias ChangeNoteEvent =
    { notes : List String
    , display : String
    , index : Int
    }


type Msg
    = SetDebugMessage String
    | StartGame String
    | ReceiveEndGame String
    | ReceiveKeyEvent KeyEvent
    | ReceiveChangeNote ChangeNoteEvent
    | ReceiveNotePressEvent NotePressEvent
    | Tick Time


getSecond : List a -> Maybe a
getSecond list =
    List.head (List.drop 1 list)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetDebugMessage msg ->
            ( { model | debugMessage = msg }, Cmd.none )

        ReceiveChangeNote note ->
            ( { model
                | shownNote = note.display
                , tried = []
                , shownNotes = note.notes
                , wrong = False
                , shownIndex = note.index
                , scored = False
              }
            , Cmd.none
            )

        StartGame mode ->
            ( { model | inCountdown = True, countdown = 3, score = 0, wrong = False, tried = [], shownIndex = 0, gameMode = mode }, Cmd.none )

        ReceiveEndGame msg ->
            ( { model | gameOn = False }, Cmd.none )

        ReceiveKeyEvent keyEvent ->
            case keyEvent.event of
                "keydown" ->
                    case keyEvent.key of
                        "Escape" ->
                            ( { model | gameOn = False }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ReceiveNotePressEvent event ->
            if model.gameMode == "chord" then
                (if model.gameOn then
                    let
                        newTried =
                            model.tried ++ [ event.scaleNote ]

                        complete =
                            List.sort newTried == List.sort model.shownNotes

                        _ =
                            Debug.log (toString newTried) complete
                    in
                        (if complete then
                            ( { model | score = model.score + 1, scored = True }, Cmd.none )
                         else
                            ( { model | tried = newTried }, Cmd.none )
                        )
                 else
                    ( model, Cmd.none )
                )
            else if
                model.gameOn
                    && not model.scored
                    && List.head model.shownNotes
                    == Just event.scaleNote
            then
                ( { model | score = model.score + 1, scored = True }, Cmd.none )
            else
                ( { model | scored = True, wrong = True }, Cmd.none )

        Tick _ ->
            if model.inCountdown then
                if model.countdown > 1 then
                    ( { model | countdown = model.countdown - 1 }, Cmd.none )
                else
                    ( { model | inCountdown = False, gameOn = True }, newGame model.gameMode )
            else
                ( model, Cmd.none )


port debug : (String -> msg) -> Sub msg


port endGame : (String -> msg) -> Sub msg


port newGame : String -> Cmd msg


port keyEvent : (KeyEvent -> msg) -> Sub msg


port changeNote : (ChangeNoteEvent -> msg) -> Sub msg


port notePressed : (NotePressEvent -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ debug SetDebugMessage
        , keyEvent ReceiveKeyEvent
        , changeNote ReceiveChangeNote
        , endGame ReceiveEndGame
        , notePressed ReceiveNotePressEvent
        , Time.every second Tick
        ]


init : ( Model, Cmd Msg )
init =
    ( defaultModel, Cmd.none )


score : Int -> Html Msg
score value =
    div [ class "score" ] [ text ("Score: " ++ (toString value)) ]


progress : Html Msg
progress =
    div [ class "progress-container" ]
        [ div [ class "progress" ]
            [ text "" ]
        , div
            [ class "progress-inner" ]
            [ text "" ]
        ]


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


view : Model -> Html Msg
view model =
    div []
        (if model.gameOn then
            [ div []
                [ text ("#" ++ (toString (model.shownIndex + 1))) ]
            , div
                [ class "shown-note" ]
                [ text model.shownNote ]
            , score model.score
            , progress
            , div [ class "wrong" ]
                [ text
                    (if model.wrong then
                        "NOPE"
                     else
                        ""
                    )
                ]
            ]
         else if model.inCountdown then
            [ div [ class "countdown" ] [ text (toString model.countdown) ] ]
         else
            [ button [ onClick (StartGame "note") ] [ text "Start game (note)" ]
            , button [ onClick (StartGame "chord") ] [ text "Start game (chord)" ]
            , score model.score

            -- , debugMessages model.debugMessage
            ]
        )
