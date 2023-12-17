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

type Llama2Request struct {
	Prompt       string  `json:"prompt"`
	MaxGenLength int     `json:"max_gen_len,omitempty"`
	Temperature  float64 `json:"temperature,omitempty"`
}

type Llama2Response struct {
	Generation string `json:"generation"`
}

type InputPrompt struct {
	Prompt string `json:"prompt"`
}

func handler(ctx context.Context, event *InputPrompt) (*string, error) {
	mySession := session.Must(session.NewSession())
	svc := bedrockruntime.New(mySession)

	modelId := "meta.llama2-13b-chat-v1"

	body, err := json.Marshal(Llama2Request{
		Prompt:       event.Prompt,
		MaxGenLength: 512,
		Temperature:  0.5,
	})

	var errorresp string
	if err != nil {
		errorresp = fmt.Sprintf("Unable to Marshal Llama2Request: %s", event.Prompt)
		return &errorresp, err
	}

	req, resp := svc.InvokeModelRequest(&bedrockruntime.InvokeModelInput{
		ModelId: &modelId, Body: body,
	})

	if err := req.Send(); err != nil {
		errorresp = "Error sending model invocation."
		return &errorresp, err
	}

	var response Llama2Response
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		errorresp = "Unable to Unmarshal Llama2Response."
		return &errorresp, err
	}

	return &response.Generation, nil
}

func main() {
	lambda.Start(handler)
}
