---
title: "A clean MLE derivation"
date: 2025-09-17
tags: ["MLE", "asymptotics"]
draft: true
---

We’ll solve for $\hat\theta$ from $\ell'(\hat\theta)=0$ and show the asymptotic normality:

$$
\sqrt{n}\,(\hat\theta-\theta_0)\xrightarrow{d}\mathcal{N}\!\bigl(0, I(\theta_0)^{-1}\bigr).\tag{1}
$$

{{< theorem n="1" >}}Under regularity conditions, (1) holds by the MLE central limit theorem.{{< /theorem >}}
{{< proof >}}Use Taylor around $\theta_0$ and the LLN/CLT for the score.{{< /proof >}}
