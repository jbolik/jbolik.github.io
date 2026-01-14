---
title: "Post-data: Modeling Measurement Error"
date: 2025-12-18
tags: ["Measure Theory", "Conditional Expectation", "Disintegration Theorem"]
draft: true
---

Usually Bayesian statisticians do not explicitely model the measurement noise. Assume $X$ is a Standard Borel Space. If we would include a measurement error that models the distribution of the true value $x$ a function of the observed value $x'$, so $x \sim f(x')$, with $f: X \rightarrow {\mu \in \mathcal{P}(X): \mu << \nu}$, the posterior would be
$$\mathbb{E}_{x \sim f(x')}\left[p(\theta \mid x)\right]$$
Here $\nu$ is the marginal distribution on $x$ from disintegrating $p(x, \theta)$ into conditional measures $p(\theta \mid x)$ and a marginal measure $\nu(x)$. Similar to the pre-data setting, this posterior is now well-defined in a measure-theoretic sense, since we integrating over $x$. It might be more intuitive to model the distribution of $x'$ as a function of $x$, but the disintegration theorem will not uniquely give us a $x$ as a function of $x'$ for all values of $x$, but only almost all, which is not sufficient post-data.