package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/bedrockruntime"
)

var (
	// DefaultHTTPGetAddress Default Address
	DefaultHTTPGetAddress = "https://checkip.amazonaws.com"

	// ErrNoIP No IP found in response
	ErrNoIP = errors.New("No IP in HTTP response")

	// ErrNon200Response non 200 status code in response
	ErrNon200Response = errors.New("non 200 response found")
)

type Llama2Request struct {
	Prompt       string  `json:"prompt"`
	MaxGenLength int     `json:"max_gen_len,omitempty"`
	Temperature  float64 `json:"temperature,omitempty"`
}

type Llama2Response struct {
	Generation string `json:"generation"`
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	mySession := session.Must(session.NewSession())
	svc := bedrockruntime.New(mySession)

	modelId := "meta.llama2-13b-chat-v1"
	prompt := "Your role is to provide feedback on a decision that I am trying to make. Here are the rules: 1) the conversation begins with you asking the exact question “What decision are you trying to make?” — don’t say anything else in your first response, 2) use prospect theory to weigh the tradeoffs of making the decision and the biases that might be at play, 3) relate the decision back to my sense of purpose and why I’m making the decision, 4) under no circumstances should you say what choice is more rational or better and avoid giving me feedback about what I might want to do — instead, you should push me to consider my reference point, the potential uncertainties, gains and losses, and how this relates to my sense of purpose in life, 5) consider how deeply felt my sense of purpose is as part of the reference point. You can begin."

	body, err := json.Marshal(Llama2Request{
		Prompt:       prompt,
		MaxGenLength: 512,
		Temperature:  0.5,
	})

	req, resp := svc.InvokeModelRequest(&bedrockruntime.InvokeModelInput{
		ModelId: &modelId, Body: body,
	})
	err = req.Send()

	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	var response Llama2Response
	if err := json.Unmarshal(resp.Body, &response); err != nil {
		log.Fatal("failed to unmarshal", err)
	}

	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	gen := response.Generation
	return events.APIGatewayProxyResponse{
		Body:       fmt.Sprintf(gen),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}
