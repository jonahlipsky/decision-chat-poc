# Development Notes

## 3 Jan 2023
Poe.com already has a full-fledged multi-topic way of conversing with multifarious chatbots. This liberates me from the idea that I should create a place where people can discuss various things with various chatbots. Instead, this can be focused on decision making.

I had an idea about the finances of this. When someone puchases tokens to use in decision chat, those tokens could be stored in a bank account earning interest. So if we sell the tokens in $1 increments, that is backed by some money that earns whatever the current interest rate is. The next step to this idea is that it could be backed by USDC cryptocurrency earning whatever the interest rate there is. A further idea is that there could be an option to convert the USDC into a custom cryptocurrency that is used specifically for decision chat. If one selects this option, then what can happen is that however much Karma that person has developed in the system will come back to them as these custom tokens on a monthly basis. For a user with a lot of Karma, this will essentially mean that they will be able to converse with the chatbots for free for life. That'd be pretty cool since most options out there charge a subscription fee that feels a little hefty. I'm sure the economics of this would have to be figured out so that we're sure that these high Karma users are bringing in more than we're giving out, but that shouldn't be too hard. It would be the high Karma users who would improve the experience the most, so I think that would end up being fair. One way to avoid hacking the system is to make sure we have good OAuth in place but then also eventually implement a Karma minimum that you have to attain before you can upvote other things. At first, this requirement should not be there, since at first this will only be offered to people who we trust anyway.

If we offer a "free chat" option in addition to all the decision chat prompts, this could end up being an optimally cost-effective way to chat to the various chatbots. If we implement a full fledged set of features along with this such as chat history and encryption so you can be reasonably sure that no one is reading your chats, this could become one of the superior ways to experience the chatbots.

The approval of submitted decision making prompts will have to be ad-hoc by committee (even a committee of one) at first. Over time, it could develop into a natural language processing problem where there could be an assessment based on past accepted ones and other factors. That should be the goal to shoot for but it might be that human-in-the-loop is always good to ensure that the prompts are appropriate and ethical.

-- 

Coming back to this a few hours later. A couple additional ideas:

1) There's a chance that there is a general applicability to this idea and that it doesn't have to be solely focused on decision making. For instance, Poe is not doing upvoting, comments, or publishing the system prompt. Also, everyone seems to be charging a subscription model, so a pay-as-you-go model might have its own appeal because low to moderate users don't have to pay so much.

It definitely makes sense to start with Decision Making and to demo its applicability, but it is sort of like building a community in reddit — the "Decision Making" community for this idea. There could be any other type of community which might have its own administration approach and way that prompts get approved. Building it with the idea in mind that it could become the "communities" feature within a larger app allows it to expand in that direction.

2) Another way of creating a virtuous cycle is to split profit with people who have published the models. Essentially, if we charged 1.1x the cost of running this, and for every prompt that gets used the creator earns half of whatever is above the cost, then that would be another way for the tokens to feed back to the creator. It could be that one person creates the prompt, and then another person perfects it. In that case, the person who perfects it would get whatever benefit accrues, or perhaps there's a way to signal that it is split between multiple people? It's probably simplest to let it accrue to whoever published the model that actually gets used. If it's that much better, then there's a real difference, and this is the kind of crowd-sourcing that we hope to encourage. We hope to generate the most useful prompts for people. 

## 26 December 2023
In an attempt to get something out quick that would suffice for showing people what I'm working on, I deployed to Vercel. Then it became clear that the long wait for a server response was not going to work because Vercel has a 10 second timeout on serverless functions for the hobby plan. The pro account costs $20/month which doesn't seem worth it, especially when the long wait for a response is a code smell and an anti-pattern. I should implement the streaming of the text back to the client. That also has some challenges because I am not sure how it will work to stream the data back to the serverless function and then propagate those responses to the frontend. This is a good next step because it will test whether Next.js / Vercel is ultimately the right technology choice for this.

## 25 December 2023
I think that the next step is to consider creating a free text page.
Then there are plenty of options as far as how I want to package this.
Also the style of the text box and submit button need to improve.
Also the color scheme of the chat, although this could be run by the more artistically minded. It might be more of a text bubble rather than raw text that have different colors.
