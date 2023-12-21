package main

import (
	"context"
	"encoding/json"
	"fmt"

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

func handler(ctx context.Context, event *InputPrompt) (*string, error) {
	mySession := session.Must(session.NewSession())
	svc := bedrockruntime.New(mySession)

	modelId := "anthropic.claude-v2"

	body, err := json.Marshal(ClaudeRequest{
		Prompt:            event.Prompt,
		MaxTokensToSample: 4000,
		Temperature:       0.5,
	})

	var errorresp string
	if err != nil {
		errorresp = fmt.Sprintf("Unable to Marshal request: %s", event.Prompt)
		return &errorresp, err
	}

	req, resp := svc.InvokeModelRequest(&bedrockruntime.InvokeModelInput{
		ModelId: &modelId, Body: body,
	})

	if err := req.Send(); err != nil {
		errorresp = "Error sending model invocation."
		return &errorresp, err
	}

	var response ClaudeResponse
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		errorresp = "Unable to Unmarshal ClaudeResponse."
		return &errorresp, err
	}

	return &response.Completion, nil
}

func main() {
	lambda.Start(handler)
}
