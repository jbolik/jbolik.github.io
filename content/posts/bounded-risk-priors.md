---
title: "The Role of Prior Tails in Prediction"
date: 2025-10-14
tags: ["posterior predictive", "priors", "predictive risk"]
draft: false
---

## Introduction

Consider the problem of predicting the next observation from a model $\mathcal{N}(\mu, 1)$ with unknown $\mu$ after observing multiple samples $X_1, \dots, X_n$. We want to provide a predictive density $q$ that quantifies how we expect the next observation $X_{n+1}$ to look like. Intuitively, we want the predictive density to assign the highest possible probability density $q(X_{n+1})$ to the value we will actually observe for $X_{n+1}$. Of course, $X_{n+1}$ as well as $X_1, \dots, X_n$ are random so we can only reason about them in expectation. 

{{< remark >}}
If we were to observe multiple values for $X_{n+1}$, say $X^1_{n+1}, \dots, X^m_{n+1}$, our predictive density would simply be the product $q(X^1_{n+1}) * \dots * q(X^m_{n+1})$ since the observations are independently drawn from our model. So the predictive density is multiplicative, while expectation is additive. To account for that, we consider the log-density instead.
{{< /remark >}}

The expectation of the log-density gives the optimization problem:

$$\argmax_{q} \E_{X_1, \dots, X_{n+1} \mid \mu}\left[\log q(X_{n+1} \mid X_1, \dots, X_n)\right]$$

where $X_1, \dots, X_{n+1} \mid \mu \sim \mathcal{N}(\mu, 1)$. Of course, this optimization problem is ill-posed since we do not know $\mu$. There are two main approaches to this problem: We could place assume that the unknown parameter $\mu$ is drawn from some probability distribution $\pi$ reflecting our prior knowledge about the parameter, resulting in the optimization problem:


$$q_\pi^* = \argmax_q \E_{\mu} \left[\E_{X_1, \dots, X_{n+1} \mid \mu}\left[\log q(X_{n+1} \mid X_1, \dots, X_n)\right]\right]$$

The other option is considering the worst-case performance across all possible values of $\theta$:

$$\argmax_q \argmin_\mu \E_{X_1, \dots, X_{n+1} \mid \mu}\left[\log q(X_{n+1} \mid X_1, \dots, X_n)\right]$$

{{< remark >}}
For the second optimization problem in particular, one usually wants to subtract the log-likelihood assigned by the true model itself as a baseline, so essentially the entropy of the model. This has many advantages like independence of the base measure used for the probability densities, and meaningful guarantees if the entropy of our model can go to infinity. Furthermore, this reveals a direct connection to the Kullback-Leibler divergence. In our example the entropy is constant in $\mu$, so both optimization problems are equivalent.
{{< /remark >}}

The first optimization problem is solved by the Bayesian posterior predictive distribution [Aitchinson 1975]:

$$
q_\pi^* = \int p(x_{n+1} \mid \mu) \frac{\prod_{i=1}^n p(x_i \mid \mu) \pi(\mu)}{\int \prod_{i=1}^n p(x_i \mid \mu') \pi(\mu') d\mu'} d\mu
$$

The second one is harder to solve in general, but in our example, it can be shown that is is solved by the Bayesian posterior predictive distribution with the objective prior $p(\mu) \propto 1$. [add reference] 

{{< remark >}}
Objective priors like $p(\mu) \propto 1$ are improper: They do not integrate to 1 and therefore are not valid probability densities. However, we can still use them within the Bayesian framework as long as the resulting posterior distribution is a proper probability distribution.
{{< /remark >}}

Let us look at the predictive performance for various $\mu$ using the prior $\mu \sim \mathcal{N}(0, 1)$ (blue line) and the improper prior $p(\mu) \propto 1$ (orange line) after three observations across different true values of $\mu$:

![Predictive comparison]( /img/normal-pred-comparison.svg )

We can see that the predictive performance of the improper prior is constant across different true values of $\mu$. Meanwhile, the prior $\mu \sim \mathcal{N}(0, 1)$ yields an inprovement close to $0$, as expected. However, it can yield arbitrarily bad predictive performance as the true mean goes away from $0$. Unless our prior knowledge is very strong, this is a large price to pay and is only mitigated but not avoided by increasing the prior variance. This raises the question whether it is possible to have proper priors without this undesirable property, or whether this is an unavoidable compromise one has to make when using proper priors.

## Liang's Prior
Consider the following two-stage heavy-tailed prior, a special case of what was proposed by Feng Liang:
$$
\mu \sim \mathcal{N}(0, 1/a), \qquad p(a) = \frac{1}{(1+a)^2}
$$

In her dissertation she shows that in the multivariate regression model $\mathcal{N}(\mu, I)$ *with dimension greater than 6* this prior not only has lower-bounded predictive performance but also always performs better then $p(\mu) \propto 1$. 

Now, we want to visualize how exactly it performs compared to our other two standard priors for the one-dimensional model $\mathcal{N}(\mu, 1)$. This comes with some computational challenges, since we need to evaluate the log-likelihood of the posterior predictive under this prior in expectation over $y_1, \dots, y_n, y^* \sim \mathcal{N}(\mu, 1)$. To be precise, we need to evaluate:
$$
\E_{y_1, \dots, y_n, y^* \sim \mathcal{N}(\mu, 1)}\left[\log\left(\frac{\int_{-\infty}^\infty p(y^* \mid \nu) p(y_{1:n} \mid \nu) \int_0^\infty \mathcal{N}(\nu \mid 0, 1/a) \frac{1}{(1+a)^2} da d\nu}{\int_{-\infty}^\infty p(y_{1:n} \mid \nu) \int_0^\infty \mathcal{N}(\nu \mid 0, 1/a) \frac{1}{(1+a)^2} da d\nu}\right)\right]
$$
Since the integrands are positive, we can switch the order of integration so that we can perform some of it analytically:
$$
\E_{y_1, \dots, y_n, y^* \sim \mathcal{N}(\mu, 1)}\left[\log\left(\frac{\int_0^\infty \frac{1}{(1+a)^2} \int_{-\infty}^\infty p(y^* \mid \nu) p(y_{1:n} \mid \nu) \mathcal{N}(\nu \mid 0, 1/a) d\nu da}{\int_0^\infty \frac{1}{(1+a)^2} \int_{-\infty}^\infty p(y_{1:n} \mid \nu) \mathcal{N}(\nu \mid 0, 1/a) d\nu da}\right)\right]
$$
Solving the inner integrals and simplifying, we have
$$
\E_{y_1, \dots, y_n, y^* \sim \mathcal{N}(\mu, 1)}\left[\log\left(\frac{\int_0^\infty \frac{1}{(1+a)^2} \sqrt{\frac{a}{a+n+1}} \exp\left(\frac{1}{2}\frac{(S + y^*)^2}{a+n+1}\right) da}{\int_0^\infty \frac{1}{(1+a)^2} \sqrt{\frac{a}{a+n}} \exp\left(\frac{1}{2} \frac{S^2}{a+n}\right) da}\right)  - \frac{{y^\*}^2}{2} \right] - \frac{\log(2\pi)}{2}
$$
where $S = \sum_{i=1}^n y_i \sim \mathcal{N}(n \mu, n)$. We reparametrize the inner integral as $t = \frac{a}{1+a}$ or equivalently $a = \frac{t}{1-t}$. This gives $dt = \frac{1}{(1+a)^2} da$. Additionally we have a closed-form for $\E[{y^\*}^2]$ since it follows a non-central $\chi^2$-distribution.

$$
\E_{y_1, \dots, y_n, y^* \sim \mathcal{N}(\mu, 1)}\left[\log\left(\frac{\int_0^1 \sqrt{\frac{t}{n+1-nt}} \exp\left(\frac{1}{2} \frac{(S + y^*)^2}{\frac{t}{1-t}+n+1}\right) dt}{\int_0^1 \sqrt{\frac{t}{n+t-nt}} \exp\left(\frac{1}{2} \frac{S^2}{\frac{t}{1-t}+n}\right) dt}\right)\right]  - \frac{\mu^2 + \log(2\pi) + 1}{2}
$$

We evaluate the inner ratio of integrals using Gauss-Legendre quadrature on the same 40 nodes for both integrals, and using the logsumexp-trick for numerical stability. The outer expectation is evaluated using a Monte Carlo estimate with 100,000 samples, shared across all values of $\mu$. We know the function is even in $\mu$, $f(\mu) = f(-\mu)$. To account for the correlation of estimation errors for different $\mu$, we project the result onto the space of even functions, $\hat{f}(\mu) = \frac{f_{MC}(\mu) + f_{MC}(-\mu)}{2}$. This adds the green line for the predictive performance under the proper prior $\mu \sim \mathcal{N}(0, 1/a), p(a) = \frac{1}{(1+a)^2}$ to our plot:
![Predictive comparison 2]( /img/normal-pred-comparison2.svg )

We can see that unlike the light-tailed Gaussian prior, the predictive performance doesn't diverge to $-\infty$ as $|\mu| \rightarrow \infty$, but converges to a constant level. Additionally, we still get the improved predictive performance around 0. In this low-dimensional setting we do have to give up some predictive performance for medium-large  values of $|\mu|$ compared to $p(\mu) \propto 1$, but this effect disappears in higher dimensions.

## References
**Aitchison, J.** (1975). *Goodness of prediction fit*. **Biometrika**, 62(3), 547–554.

**Liang, F.** (2002). *Exact minimax procedures for predictive density estimation and data compression* (Doctoral dissertation, Yale University). Dissertation Director: Andrew R. Barron.

