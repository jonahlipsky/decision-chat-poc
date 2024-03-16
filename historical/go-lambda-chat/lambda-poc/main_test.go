package main

import (
	"testing"
)

func TestHandler(t *testing.T) {
	// t.Run("Unable to get IP", func(t *testing.T) {
	// 	DefaultHTTPGetAddress = "http://127.0.0.1:12345"

	// 	_, err := handler(events.APIGatewayProxyRequest{})
	// 	if err == nil {
	// 		t.Fatal("Error failed to trigger with an invalid request")
	// 	}
	// })

	// t.Run("Non 200 Response", func(t *testing.T) {
	// 	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		w.WriteHeader(500)
	// 	}))
	// 	defer ts.Close()

	// 	DefaultHTTPGetAddress = ts.URL

	// 	_, err := handler(events.APIGatewayProxyRequest{})
	// 	if err != nil && err.Error() != ErrNon200Response.Error() {
	// 		t.Fatalf("Error failed to trigger with an invalid HTTP response: %v", err)
	// 	}
	// })

	// t.Run("Unable decode IP", func(t *testing.T) {
	// 	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		w.WriteHeader(500)
	// 	}))
	// 	defer ts.Close()

	// 	DefaultHTTPGetAddress = ts.URL

	// 	_, err := handler(events.APIGatewayProxyRequest{})
	// 	if err == nil {
	// 		t.Fatal("Error failed to trigger with an invalid HTTP response")
	// 	}
	// })

	// t.Run("Successful Request", func(t *testing.T) {
	// 	_, err := handler(events.APIGatewayProxyRequest{
	// 		Body: "{ \"prompt\": \"Human: Your role is to provide feedback on a decision that I am trying to make. You can begin.\n  \n  Assistant:\" }",
	// 	})
	// 	if err != nil {
	// 		t.Fatal("Everything should be ok")
	// 	}
	// })

	// t.Run("Marshal and Unmarshal InputPrompt", func(t *testing.T) {
	// 	input := InputPrompt{
	// 		Prompt: "Human: Your job... \n\n Assistant:",
	// 	}
	// 	encoded, _ := json.Marshal(input)
	// 	fmt.Print("hello")
	// 	fmt.Print(encoded)
	// 	var decoded InputPrompt
	// 	json.Unmarshal(encoded, &decoded)
	// })
}
