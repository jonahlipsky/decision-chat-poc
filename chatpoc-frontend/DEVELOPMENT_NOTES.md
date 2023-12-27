# Development Notes

# 26 December 2023
In an attempt to get something out quick that would suffice for showing people what I'm working on, I deployed to Vercel. Then it became clear that the long wait for a server response was not going to work because Vercel has a 10 second timeout on serverless functions for the hobby plan. The pro account costs $20/month which doesn't seem worth it, especially when the long wait for a response is a code smell and an anti-pattern. I should implement the streaming of the text back to the client. That also has some challenges because I am not sure how it will work to stream the data back to the serverless function and then propagate those responses to the frontend. This is a good next step because it will test whether Next.js / Vercel is ultimately the right technology choice for this.

## 25 December 2023
I think that the next step is to consider creating a free text page.
Then there are plenty of options as far as how I want to package this.
Also the style of the text box and submit button need to improve.
Also the color scheme of the chat, although this could be run by the more artistically minded. It might be more of a text bubble rather than raw text that have different colors.
