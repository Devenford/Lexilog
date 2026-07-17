# Lexilog
Gamified Vocabulary Trainer App

## Spaced Repetition (SM-2)

This application uses a modified version of the **SM-2 (SuperMemo 2)** spaced repetition algorithm to schedule vocabulary reviews. Rather than asking users to rate how well they remembered a word, the application automatically determines the quality of the review based on the user's performance.

### How it works

Each user has a progress record for every word they have studied. This record stores:

* **Repetitions** – The number of consecutive successful reviews.
* **Interval** – The number of days until the next review.
* **Ease Factor (EF)** – A value that determines how quickly the review interval increases. New words begin with an ease factor of **2.5**.
* **Due Date** – The next scheduled review date.
* **Last Reviewed** – The date the word was most recently reviewed.

### Review Process

When a user practices a word, the application evaluates how well they performed. Instead of asking the user to choose a rating, the review quality is calculated automatically based on the number of attempts required to answer correctly.

The calculated review quality is then used to update the SM-2 values:

* Words answered correctly on the first attempt receive longer review intervals.
* Words requiring multiple attempts are scheduled to reappear sooner.
* The ease factor is adjusted over time so that difficult words are reviewed more frequently, while familiar words gradually appear less often.

Finally, a new **due date** is calculated by adding the updated interval to the current date.

### Why SM-2?

The goal of spaced repetition is to review information **just before it is likely to be forgotten**. By adapting the review schedule to each user's performance, the application focuses practice on words that need reinforcement while reducing unnecessary repetition of words that have already been learned.

### Implementation

Vocabulary content is stored separately from user progress. The `Word` collection contains the vocabulary data (word, paragraphs, multiple-choice options, and difficulty), while the `UserWord` collection stores each user's SM-2 progress. This allows every user to have an independent learning schedule for the same vocabulary word.
