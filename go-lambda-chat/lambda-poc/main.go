package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/bedrockruntime"
)

// var (
// 	// DefaultHTTPGetAddress Default Address
// 	DefaultHTTPGetAddress = "https://checkip.amazonaws.com"

// 	// ErrNoIP No IP found in response
// 	ErrNoIP = errors.New("No IP in HTTP response")

// 	// ErrNon200Response non 200 status code in response
// 	ErrNon200Response = errors.New("non 200 response found")
// )

type ClaudeRequest struct {
	Prompt            string  `json:"prompt"`
	MaxTokensToSample int     `json:"max_tokens_to_sample"`
	Temperature       float64 `json:"temperature,omitempty"`
}

type ClaudeResponse struct {
	Completion string `json:"completion"`
}

type InputPrompt struct {
	Prompt string `json:"prompt"`
}

// Note that body has to be a stringified json of the InputPrompt structure
// i.e.
//
//	{
//		"body": "{ \n  \"prompt\": \"Human: ...\\n\\nAssistant:\"\n}"
//	}
func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Printf("Lambda invoked. Body: %s", request.Body)
	mySession := session.Must(session.NewSession())
	svc := bedrockruntime.New(mySession)

	modelId := "anthropic.claude-v2"
	var input InputPrompt

	// NOTE: COME BACK TO THIS FOR SECURITY CONCERNS
	headers := map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}
	multiheaders := map[string][]string{}
	badrequest := 400

	var errorresp string

	log.Printf("Attempting to unmarshal request body: %s", string(request.Body))
	if err := json.Unmarshal([]byte(request.Body), &input); err != nil {
		errorresp = fmt.Sprintf("Unable to unmarshal request body: %s", request.Body)
		return events.APIGatewayProxyResponse{badrequest, headers, multiheaders, string(errorresp), false}, err
	}

	log.Print("Attempting to marshal request.")
	body, err := json.Marshal(ClaudeRequest{
		Prompt:            input.Prompt,
		MaxTokensToSample: 4000,
		Temperature:       0.5,
	})

	if err != nil {
		errorresp = fmt.Sprintf("Unable to Marshal request: %s", input.Prompt)
		return events.APIGatewayProxyResponse{badrequest, headers, multiheaders, string(errorresp), false}, err
	}

	req, resp := svc.InvokeModelRequest(&bedrockruntime.InvokeModelInput{
		ModelId: &modelId, Body: body,
	})

	log.Print("Attempting to send invocation.")
	if err := req.Send(); err != nil {
		errorresp = "Error sending model invocation."
		return events.APIGatewayProxyResponse{badrequest, headers, multiheaders, string(errorresp), false}, err
	}

	log.Print("Attempting to unmarshal response.")
	var response ClaudeResponse
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		errorresp = "Unable to Unmarshal ClaudeResponse."
		return events.APIGatewayProxyResponse{badrequest, headers, multiheaders, string(errorresp), false}, err
	}

	return events.APIGatewayProxyResponse{200, headers, multiheaders, string(resp.Body), false}, nil
}

func main() {
	lambda.Start(handler)
}
