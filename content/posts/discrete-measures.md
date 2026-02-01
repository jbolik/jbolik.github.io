---
title: "Non-Discreteness Makes Zero Probability Events Happen"
date: 2026-01-31
tags: ["Measure Theory"]
draft: false
---

A probability space $(X, \Sigma, \mu)$ is defined as discrete if there exists a countable set of points $S = \\{x_1, x_2, \dots\\}$ with $x_i \in X$ and real weights $\alpha_i > 0$ such that $\mu$ can be expressed for all $A \in \Sigma$ as $\mu(A) = \sum_{i=1}^\infty \alpha_i 1_{x_i \in A}$. In this post we will show an interesting characterization of discreteness. Let $N := \\{A \in \Sigma | \mu(A) = 0\\}$ be the set of probability zero events. Then $(X, \Sigma, \mu)$ is discrete *if and only if* $\forall A \in \Sigma: A \subseteq \cup N \Rightarrow \mu(A) = 0$. This holds very generally, without requiring additional assumptions like that the probability space is Borel.

## Forward Direction
The forward direction is pretty straightforward: First for every $A \in N$ we must have $\sum_{i=1}^\infty \alpha_i 1_{x_i \in A} = 0$. Since $\alpha_i > 0$, $\mu(A) = 0$ implies $\forall x_i: x_i \notin A$, or put differently, $A \subseteq S^c$. Therefore $\cup N \subseteq S^c$. Consequently, for any measurable set $A \in \Sigma$, if $A \subseteq \cup N$, then $A \subseteq S^c$. By the definition of our discrete measure, this implies $\mu(A) = 0$.

## Reverse Direction
For the backward direction, it might be tempting to use the familiar pure point / absolutely continuous / singular continuous decomposition (e.g. for Borel measures on $\mathbb{R}$). But it relies on extra structure (a topology and a reference measure). In our fully general measurable-space setting, the intrinsic tool is the notion of atoms. A set $A \in \Sigma$ is called an atom if $\mu(A) > 0$ and $\forall B \in \Sigma: B \subseteq A \Rightarrow \mu(B) \in \\{0, \mu(A)\\}$. Consider the following theorem due to Saks:

{{< theorem n="1" >}}
> **Saks' Lemma (1933)**: Given a probability space $(X, \Sigma, \mu)$ and an arbitrary real number $\epsilon > 0$, $X$ may be partitioned into a finite number of sets $E_1, \dots, E_p \in \Sigma$ such that every $E_i$ is an atom or has measure $\leq \epsilon$. 
{{< /theorem >}}

As a corollary we get Saks' decomposition:
{{< theorem n="2" >}}
> **Saks' Decomposition**: Every probability space $(X, \Sigma, \mu)$ can be decomposed as $(X_1 \cup X_2, \Sigma, \mu_1 + \mu_2)$ such that 
> 1. $X_1 \cap X_2 = \emptyset$ and $\mu_1(X_2) = \mu_2(X_1) = 0$
> 2. $X_1$ is the union of a countable set of disjoint atoms
> 3. $X_2 \subseteq \cup N$ where $N := \\{A \in \Sigma | \mu(A) = 0\\}$
> 4. $(X, \Sigma, \mu_2)$ contains no atoms
{{< /theorem >}}
{{< proof >}}
Consider the countable sequence $\epsilon_i := 1/i$. By repeatedly applying Saks' lemma at each step $i$ to the part of the space that was not atomic at step $i-1$, we get the space of all atoms $X_1$ as a union of disjoint atoms in the limit. It includes all atoms, since they have positive probability mass, and there is an $i$ such that $1/i$ is smaller for every positive real number. Since the atoms are disjoint and have positive probability mass, there can only be countably many. The complement $X_2 := X \setminus X_1$ is also measurable and contains no atoms by construction. Now we can define $\mu_1(A) := \mu(X_1 \cap A)$ and $\mu_2(A) := \mu(X_2 \cap A)$. 
Now let $x$ be any point in $X_2$ and $E_i(x)$ be the set of the partition when applying Saks' lemma the $i$-th time containing that point. Let $N_x := \cap_{i=1}^\infty E_i(x)$. Then for all $i$, $N_x \subseteq E_i(x)$ and $\mu(N_x) \leq \mu(E_i(x)) \leq 1/i$. Hence $\mu(N_x) = 0$. The union of all such measure zero sets $\cup_{x \in X_2} N_x$ is a subset of $\cup N$.
{{< /proof >}}

We decompose $(X,\Sigma,\mu)$ as $(X_1\cup X_2,\Sigma,\mu_1+\mu_2)$. Our assumption says that every measurable set $A\subseteq \cup N$ has $\mu(A)=0$. By item (3) of the decomposition we have $X_2 \subseteq \cup N$, hence $\mu(X_2)=0$. Therefore $\mu_2(X)=\mu(X_2)=0$, so $\mu$ is supported on $X_1$, the union of countably many disjoint atoms.

We say that an atom $V$ has a representative $x_V \in X$ if we can determine the probability of any subset of the atom by whether it contains the atom, so 
$$\forall \text{ atoms } V: \exists x_V \in V: \forall A \in \Sigma: A \subseteq V \Rightarrow \mu(A) = 1_{x_V \in A} \mu(V)$$
Let $U$ be an atom that does not have a representative. This means that for every $x \in U$ there exists a measurable subset $T_1 \subset U$ not containing $x$ with $\mu(T_1) = \mu(U)$ or a measurable subset $T_2 \subset U$ containing $x$ with $\mu(T_2)=0$. In the first case we define $N_x := U \setminus T_1$, and in the second case $N_x := T_2$. In both cases $x \in N_x$ and $\mu(N_x) = 0$. Now $U = \cup N_x \subseteq \cup N$. Hence we must have $\mu(U) = 0$ which contradicts our assumption that $U$ is an atom. Hence every atom has a representative. Choosing a representative for every atom in our countable union of disjoint atoms, this proves that $(X, \Sigma, \mu)$ is a discrete probability space.


## References
**Saks, S.** (1933). *Addition to the Note on Some Functionals*. **Transactions of the American Mathematical Society**, 35(4), 965-970.
