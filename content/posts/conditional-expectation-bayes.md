---
title: "Borel's Paradox and Bayesian Statistics"
date: 2025-12-18
tags: ["Measure Theory", "Conditional Expectation", "Disintegration Theorem"]
draft: false
---

In measure-theoretic probability theory, conditional probabilities and expectations are not uniquely defined when conditioning on zero-probability events. This is known as Borel's paradox. Yet, in Bayesian statistics we condition on zero-probability events all the time. How does that fit together?

## Conditional Probability and Borel's Paradox
The basic definition of conditional probability was established by Bayes as $P(A \mid B) = P(A \cap B) / P(B)$. This is usually considered as an axiom in probability theory. However, the situation becomes a lot more controversial once we move to probability measures that are not discrete. Most commonly, we consider probability measures $\mu_A$ and $\mu_B$ which are absolutely continuous with respect to Lebesgue measure, $\mu_A \ll \lambda(\mathbb{R})$ and $\mu_B \ll \lambda(\mathbb{R})$, like the Gaussian distribution $\mathcal{N}(\mu, \sigma^2)$. Such measures assign zero probability to every singleton $\{x\}$ in the sample space $\mathbb{R}$. Since we cannot divide by 0, the axiomatic definition of conditional probability does not apply when conditioning on a singleton. 

Now, every Bayesian statistician will tell you that we can just apply conditional probability to probability density functions as $p(A=a \mid B=b) = p(A=a, B=b) / p(B=b)$. From a measure-theoretic perspective, probability densities are Radon-Nikodym derivatives, which are only defined up to a set of measure zero. From this perspective, if we were to define the conditional density just for one specific value of $B$, it would not be unique, since we can arbitrarily change the Radon-Nikodym derivative *at any measure zero point*. In Bayesian statistics we typically avoid this problem by limiting ourselves to probability measures $\mu_X$ that have a probability function $F(x) := P(X \leq x)$ that is differentiable $\mu_x$-almost everywhere, e.g. $\mathcal{N}(\mu, \sigma^2)$. This requires a canoncial base measure and topology on the sample space, usually given by the Lebesgue measure and Euclidean topology. Defining the probability density as the derivative of $F(x)$, *we can no longer change it at any point*, but only at the specific points where $F(x)$ is non-differentiable. The probability density function can then be uniquely defined almost everywhere as the derivative $F(x)$:
$$p(X=x) := \frac{d}{dx} F(x) := \lim_{t \rightarrow 0} \frac{P(X \leq x+t) - P(X \leq x)}{t}$$
This raises the question whether we can make a similar argument using limits to justify the application of the conditional probability rule to probability densities.  Unfortunately, Borel's paradox provides a negative answer: Consider $X, Y \sim U(0, 1)$, $R = Y / X$ and we want to define $P(X \leq x \mid Y = 0)$ through a limit. For this definition to be consistent, $\lim_{\epsilon \rightarrow 0} P(X \leq x \mid Y \leq \epsilon)$ and $\lim_{\epsilon \rightarrow 0} P(X \leq x \mid R \leq \epsilon)$ should be equal, but they are not:
$$\lim_{\epsilon \rightarrow 0} P(X \leq x \mid Y \leq \epsilon) = x \qquad\lim_{\epsilon \rightarrow 0} P(X \leq x \mid R \leq \epsilon) = x^2$$
Of course these different probability functions also imply different probability densities, with only the first one matching $p(A=a \mid B=b) = p(A=a, B=b) / p(B=b)$. 

## Two Levels of Assumptions in Bayesian Statistics
So does this mean Bayesian statistics is mathematical nonsense? No. There are parts of Bayesian statistics where Borel's paradox can be circumvented using the disintegration theorem under relatively mild assumptions. However, large parts of Bayesian statistics, like any methods that directly analyze the posterior for a given set of observations, require much stronger assumptions to be justified, which are rarely made explicit by practitioners.

# Pre-data: The Disintegration Theorem
The key is that we do not construct a conditional distribution just for one specific value of $B$ that we observed, but for all possible values of $B$ at once. Under regularity conditions that we will discuss shortly, this allows us to uniquely identify a set of conditional distributions for $\mu_B$-almost all values of $B$, a *disintegration*. Put differently, if we choose any two disintegrations, and $B$ is randomly drawn from $\mu_B$, the probability that the disintegrations disagree at that draw is zero.

# Post-data: Implicitly Modeling Observation Noise
