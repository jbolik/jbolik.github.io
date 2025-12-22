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
This raises the question: Can we use limits to justify applying the conditional probability rule to densities? Unfortunately, the **Borel-Kolmogorov paradox** provides a negative answer. Consider $X, Y \sim U(0, 1)$ and the ratio $R = Y / X$. We want to define the conditional probability $P(X \leq x \mid Y = 0)$. Since the event $Y=0$ has probability zero, we must define it as a limit of conditioning on a small neighborhood. However, the shape of that neighborhood matters.

If we approach $Y=0$ via a horizontal strip ($Y \leq \epsilon$) versus a wedge ($R \leq \epsilon$), we get different answers:
$$\lim_{\epsilon \rightarrow 0} P(X \leq x \mid Y \leq \epsilon) = x \quad \text{(Uniform)}$$
$$\lim_{\epsilon \rightarrow 0} P(X \leq x \mid R \leq \epsilon) = x^2 \quad \text{(Beta(2,1))}$$
These limits imply different probability densities ($1$ vs $2x$). Crucially, only the first limit matches the result of the standard formula $p(x \mid y) = p(x, y) / p(y)$. This reveals that the standard formula is not coordinate-neutral; it implicitly assumes limits taken along the coordinate axes ($Y \pm \epsilon$), privileging that specific parametrization over others.

## Two Levels of Assumptions in Bayesian Statistics
So does this mean Bayesian statistics is mathematical nonsense? No. There are parts of Bayesian statistics where Borel's paradox can be circumvented using the disintegration theorem under relatively mild assumptions. However, large parts of Bayesian statistics, like any methods that directly analyze the posterior for a given set of observations, require much stronger assumptions to be justified, which are rarely made explicit by practitioners.

### Pre-data: The Disintegration Theorem
The part of Bayesian statistics that requires only moderate assumptions is when we do not treat the observation as fixed, but drawn from our model and make statements about the validity of our methods only in expectation over the observations. The prime example for this is Aitchinson's theorem, which guarantees optimality of the Bayesian posterior predictive in expectation over the observations:
{{< theorem n="1" >}}The Bayesian posterior predictive is the optimal predictive procedure $q: (X_1, \dots, X_n) \rightarrow \mathcal{P}(X_{n+1})$ in the following sense:
$$\argmax_q \E_{\mu} \left[\E_{X_1, \dots, X_{n+1} \mid \mu}\left[\log q(X_{n+1} \mid X_1, \dots, X_n) - \log p(X_{n+1} \mid X_1, \dots, X_n)\right]\right]$$ 
$$=\int p(x_{n+1} \mid \mu) \frac{\prod_{i=1}^n p(x_i \mid \mu) \pi(\mu)}{\int \prod_{i=1}^n p(x_i \mid \mu') \pi(\mu') d\mu'} d\mu$$
{{< /theorem >}}

We can even generalize this to the setting where we only have absolute continuity with respect to a canonical measure, no differentiability assumptions on the probability function $F(x)$ are needed. The key is that we do not construct a conditional distribution just for one specific value of $B$ that we observed, but for all possible values of $B$ at once. Under regularity conditions that we will discuss shortly, this allows us to uniquely identify a set of conditional distributions for $\mu_B$-almost all values of $B$, a *disintegration*. 
{{< theorem n="2" >}}
Rohlin's Disintegration Theorem: Let $X$ be a universally measurable space, let $Y$ be a measurable space such that there exists a measurable injective map from $Y$ into standard Borel space, and let $\mu$ be a Borel probability measure on $X$. Let $\pi: X \rightarrow Y$ be measurable. Then there exists a system of conditional measures $\left(\mu_y\right)_{y \in Y}$ of $\mu$ with respect to $(X, \pi, Y)$. They are unique in the sense that if $\left(\nu_y\right)_{y \in Y}$ is any other system of conditional measures, then $\mu_y=\nu_y$ for $\widehat{\mu}$-almost every $y \in Y$.
{{< /theorem >}}
Since we are taking an expectation over the observations, uniqueness almost everywhere is sufficient.

### Post-data: Implicitly Modeling Observation Noise
