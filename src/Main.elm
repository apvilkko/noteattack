port module Main exposing (main)

import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (class)


debugMessages : String -> Html Msg
debugMessages msg =
    div [ class "debug-messages" ] [ text msg ]


type alias Model =
    { debugMessage : String
    }


type Msg
    = SetDebugMessage String


defaultModel : Model
defaultModel =
    { debugMessage = "" }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetDebugMessage msg ->
            ( { model | debugMessage = msg }, Cmd.none )


port debug : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    debug SetDebugMessage


init : ( Model, Cmd Msg )
init =
    ( defaultModel, Cmd.none )


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
        -- [ button [ onClick Decrement ] [ text "-" ]
        -- , div [] [ text (toString model) ]
        [ button [ onClick (SetDebugMessage "asdf") ] [ text "+" ]
        , debugMessages model.debugMessage
        ]
