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

type Llama2Request struct {
	Prompt       string  `json:"prompt"`
	MaxGenLength int     `json:"max_gen_len,omitempty"`
	Temperature  float64 `json:"temperature,omitempty"`
}

type Llama2Response struct {
	Generation string `json:"generation"`
}

func main() {
	mySession := session.Must(session.NewSession(&aws.Config{Region: aws.String("us-east-1")}))
	svc := bedrockruntime.New(mySession)

	modelId := "meta.llama2-13b-chat-v1"
	var input string
	fmt.Print("Initial Input:")
	for {
		inputReader := bufio.NewReader(os.Stdin)
		input, _ = inputReader.ReadString('\n')
		input = strings.TrimSuffix(input, "\n")
		if input == "BREAK" {
			break
		}

		body, err := json.Marshal(Llama2Request{
			Prompt:       input,
			MaxGenLength: 512,
			Temperature:  0.5,
		})

		var errorresp string
		if err != nil {
			errorresp = fmt.Sprintf("Unable to Marshal Llama2Request: %s", input)
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

		var response Llama2Response
		if err := json.Unmarshal(resp.Body, &response); err != nil {
			errorresp = "Unable to Unmarshal Llama2Response."
			fmt.Print(errorresp, err)
			break
		}

		fmt.Print(response.Generation)
	}
}
