package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/bedrockruntime"
)

type Request struct {
	Prompt            string  `json:"prompt"`
	MaxTokensToSample int     `json:"max_tokens_to_sample"`
	Temperature       float64 `json:"temperature,omitempty"`
}

type Response struct {
	Completion string `json:"completion"`
}

func main() {
	mySession := session.Must(session.NewSession(&aws.Config{Region: aws.String("us-east-1")}))
	svc := bedrockruntime.New(mySession)

	modelId := "anthropic.claude-v2"
	var input string
	fmt.Print("Initial Input:\n")
	conversation := "Human: "
	for {
		inputReader := bufio.NewReader(os.Stdin)
		input, _ = inputReader.ReadString('\n')
		input = strings.TrimSuffix(input, "\n")
		if input == "BREAK" {
			break
		}

		postfix := "\n\nAssistant:"
		conversation += input + postfix

		request := Request{
			Prompt:            conversation,
			MaxTokensToSample: 200,
			Temperature:       0.5,
		}

		body, err := json.Marshal(request)

		var errorresp string
		if err != nil {
			errorresp = fmt.Sprintf("Unable to Marshal Request: %s", input)
			fmt.Print(errorresp, err)
			break
		}

		req, resp := svc.InvokeModelRequest(&bedrockruntime.InvokeModelInput{
			ModelId: &modelId, Body: body,
		})

		if err := req.Send(); err != nil {
			errorresp = "Error sending model invocation."
			fmt.Print(errorresp, err)
			break
		}

		var response Response
		if err := json.Unmarshal(resp.Body, &response); err != nil {
			errorresp = "Unable to Unmarshal Response."
			fmt.Print(errorresp, err)
			break
		}

		conversation += " " + response.Completion + "\n\nHuman: "

		fmt.Print("\n\n*****CONVO*****\n\n")
		fmt.Print(conversation)
		fmt.Print("\n\n*****END*****\n\n")

		fmt.Print(response.Completion + "\n")
	}
}
