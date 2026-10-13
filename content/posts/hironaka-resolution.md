---
title: "Singular Asymptotics: Turning Directions into Locations"
subtitle: "How blow-ups reduce real-analytic losses to monomials"
date: 2026-07-03
tags: ["Singular Learning Theory", "Real Analysis", "Geometry"]
draft: false
toc: true
wide: true
---

Much of asymptotic statistics rests on a reassuring picture: near its minimum, the loss looks like a quadratic bowl. Its curvature tells us how uncertainty shrinks and how quickly we learn. But what happens when the bowl has flat directions, or its bottom branches and forms a cusp?

**Losing the quadratic approximation does not mean losing precise statistical predictions.** Tools from algebraic geometry let us analyze these more intricate landscapes. This post develops one of the most powerful: *resolution of singularities*. Through concrete examples and interactive figures, you will see how blow-ups separate tangled directions, turn analytic losses into monomials, and make their asymptotics calculable.

One statistical payoff is a common form for **cumulative Bayesian predictive risk**—the expected sum of Kullback–Leibler (KL) errors incurred as Bayes predicts each new observation:

$$R_n=nD_*+\lambda\log n-(m-1)\log\log n+O(1).$$

Here $D_*$ is the smallest KL error achievable by a model density; it vanishes when the model contains the truth. The constants $\lambda$ and $m$ encode the geometry near the best-fitting parameters, weighted by the prior. Under the assumptions in Section 10, this same form survives singularities that defeat ordinary Laplace approximations.

Why should geometry govern prediction? Bayesian evidence multiplies successive predictive densities, so its expected negative log ratio to the true likelihood equals cumulative risk. Evidence is also an integral over parameters: its size depends on **how much parameter space fits nearly as well as the optimum**. That is the geometric quantity we will learn to calculate.

The route runs from quadratic bowls to cusps, through blow-ups, and finally back to Bayesian learning. The central idea is simple enough to picture: **turn different directions of approach into different locations, where their behavior can be studied separately.**

{{< remark title="disclaimer" >}}
This blog post is the product of self-studying this topic for two months or so using AI. This is the first time I am trying to understand a major new topic primarily through AI, directly checking arguments and literature references for the key theorems. That said, this topic is still new to me and unlike my previous posts I heavily relied on AI (GPT 5.6 and 6) for the creation of this post, so take it with a grain of salt. I hope it provides an intuitive but rigorous entry point to algebraic geometry tools for others in theoretical statistics. Please inform me about any errors you may find!
{{< /remark >}}

## 1. From Laplace asymptotics to singular directions

Let $q$ be the true density and $p_w$, $w\in\Omega\subset\mathbb R^d$, the model densities, where $\Omega$ is open. Write $D_*:=\min_w\operatorname{KL}(q\,\|\,p_w)<\infty$ and define the nonnegative population excess loss

$$K(w):=\operatorname{KL}(q\,\|\,p_w)-D_*.$$

Our geometric object is the deterministic integral

$$Z_n:=\int_\Omega e^{-nK(w)}\varphi(w)\,dw.$$

It measures the prior-weighted effective volume of parameters with small excess loss. Actual evidence, normalized by the likelihood of a best-fitting model density, uses an empirical log-density ratio in place of $K$; Section 10 justifies transferring the asymptotics of $Z_n$ to that random integral. In a well-specified model, the Hessian of $K$ at a best-fitting parameter is the Fisher information matrix under the usual differentiation and integrability conditions. We allow this Hessian to be singular, and we also allow misspecification.

### What minimization already tells us

Before singular geometry enters, minimization already imposes strong local constraints. These recover ordinary Laplace asymptotics in regular cases and reveal exactly what can fail in singular ones.

{{< remark title="standing assumptions and notation" >}}
Throughout, $\varphi$ is a nonnegative continuous **localizing amplitude** with compact support in $\Omega$. Thus $Z_n$ measures a compact portion of parameter space; $\varphi$ need not represent an entire prior. Section 10 explains how tail bounds extend the calculation to full-support priors. After separating open components on which $K\equiv0$, the power-and-logarithm formula uses the positivity condition made precise in Section 9: the smallest component ratio and largest tie over the resolved support must be attained where the amplitude is positive. Until real analyticity is imposed in Section 2, assume the derivatives and remainder bounds used in the displayed Taylor expansions.

For positive functions $A(t)$ and $B(t)$, $A(t)\asymp B(t)$ as $t\to t_0$ means that $cB(t)\leq A(t)\leq CB(t)$ near $t_0$ for constants $0\lt c\leq C\lt\infty$. By contrast, $A(t)\sim B(t)$ means $A(t)/B(t)\to1$.
{{< /remark >}}

Let $W_0:=\{w\in\Omega:K(w)=0\}$ be the set of minimizing parameters. At every relevant point $p\in W_0$,

$$K(p)=0,\qquad \nabla K(p)=0.$$

If a finite-order Taylor term is the first nonzero one, denote its degree by $\ell$ and the corresponding homogeneous polynomial by $H_\ell$. Along a fixed direction $\omega$,

$$K(p+t\omega)=t^\ell H_\ell(\omega)+o(|t|^\ell).$$

Were $\ell$ odd, the leading term would change sign between $t>0$ and $t<0$ in any direction where $H_\ell(\omega)\ne0$, contradicting $K\geq0$. Hence $\ell$ is even, and division by $t^\ell>0$ also shows $H_\ell(\omega)\geq0$.

{{< remark title="odd orders" >}}
Minimization does not eliminate every odd Taylor term: it kills the linear term and forces the *first* nonzero homogeneous term to have even degree. Odd terms may occur later. For example, $(v^2-u^3)^2/2=v^4/2-u^3v^2+u^6/2$ contains a degree-five term.
{{< /remark >}}

The regular case has $\ell=2$ and a positive-definite Hessian $Q:=D^2K(p)$:

$$K(p+z)=\frac12z^\top Qz+O(\lVert z\rVert^3).$$

Every direction then has scale $n^{-1/2}$. If $p$ is the unique zero on $\operatorname{supp}\varphi$ and $\varphi(p)>0$, ordinary Laplace asymptotics gives

$$Z_n\sim n^{-d/2}\varphi(p)\int_{\mathbb R^d}\exp\left(-\frac12y^\top Qy\right)\,dy.$$

The same mechanism applies when $W_0$ is a smooth $r$-dimensional manifold and the Hessian is positive definite normal to it: the normal coordinates contribute $n^{-(d-r)/2}$, while the tangential coordinates integrate along $W_0$. We call this the **semi-regular** case; equivalently, $\ker D^2K(p)=T_pW_0$. More generally, if the first nonzero $H_\ell$ is positive on the unit sphere, one uniform rescaling $z=n^{-1/\ell}y$ gives the local power $n^{-d/\ell}$. For instance, $x^4+y^4$ has the uniform scale $n^{-1/4}$.

### When directions carry different orders

The singular difficulty begins when no single Taylor order controls every direction. For

$$K(x,y):=x^2+y^4,$$

the scales are $x\asymp n^{-1/2}$ and $y\asymp n^{-1/4}$, producing local volume $n^{-3/4}$. These regimes are already separated by the coordinate axes. In the cusp loss

$$K(u,v):=\frac12(v^2-u^3)^2,$$

at the origin, generic straight directions have fourth-order growth, the $u$-axis has sixth-order growth, and the curved approaches $v^2=u^3$ have exact cancellation. The next relevant order can therefore depend on how a special direction is itself approached.

The four toy normal-mean models below place these regimes side by side:

{{< zero-set-gallery >}}

Panels A and B have quadratic normal geometry. Panel C has layered directional behavior, whereas panel D is already a coordinate monomial. Monomialization performs the local passage from situations like C to models like D. It does not create directional information: it changes the space so that directions which would meet at one limiting location become distinct locations upstairs, where ordinary local analysis can separate them.

## 2. What monomialization actually resolves

The arguments above require only finitely many derivatives and suitable remainder bounds. Guaranteeing the factorizations used by monomialization requires a substantially stronger assumption: from here on, the functions being resolved are real analytic. Their convergent power series allow common vanishing factors to be extracted after each blow-up. The gain is a systematic treatment of arbitrarily layered directional vanishing; the cost is the narrower analytic function class.

A function $F$ on an open subset of $\mathbb R^d$ is **real analytic** near $p$ if it equals an absolutely convergent power series on some neighborhood of $p$:

$$F(p+z)=\sum_{\alpha\in\mathbb N^d}c_\alpha z^\alpha,\qquad z^\alpha:=\prod_{j=1}^d z_j^{\alpha_j},\qquad \mathbb N:=\{0,1,2,\ldots\}.$$

The equality is exact, not merely an approximation as $z\to0$. Absolute convergence permits the terms to be grouped by total degree. If $F(p)=0$ and $F$ is not identically zero near $p$, then

$$F(p+z)=H_\ell(z)+H_{\ell+1}(z)+H_{\ell+2}(z)+\cdots,$$

where $H_j$ is homogeneous of degree $j$, meaning $H_j(cz)=c^jH_j(z)$, and $H_\ell\ne0$. The integer $\ell$ is the order of vanishing of $F$ at $p$.

Choose a norm temporarily. For $z\ne0$, define $\rho:=\lVert z\rVert$ and $\omega:=z/\lVert z\rVert$, so that $z=\rho\omega$ with $\rho>0$ and $\omega$ a unit vector. Then

$$F(p+\rho\omega)=\rho^\ell\bigl(H_\ell(\omega)+\rho H_{\ell+1}(\omega)+\rho^2H_{\ell+2}(\omega)+\cdots\bigr).$$

We have extracted a radial power $\rho^\ell$. Wherever $H_\ell(\omega)\ne0$, the remaining factor stays bounded away from zero for sufficiently small $\rho$ and nearby directions. Near a zero of $H_\ell$, however, higher-order terms may become decisive. The expansion therefore identifies directions that require further analysis.

For example, the cusp expression $F(u,v)=(v^2-u^3)^2$ has leading homogeneous term $v^4$, which vanishes along the $u$-axis. On that axis, $F(u,0)=u^6$; on the nearby curve $v^2=u^3$, it vanishes exactly. Understanding the loss near this direction requires keeping track of the relation between $u$ and $v$.

Our target is a local description in which every vanishing factor is a power of a coordinate. We seek a new space, with local coordinates $u$, and a map $g$ back to the original parameter space such that

$$F(g(u))=\varepsilon(u)\prod_{j=1}^d u_j^{a_j},\qquad \varepsilon(u)\ne0,$$

where the $a_j$ are nonnegative integers and $\varepsilon$ is analytic and nowhere zero in the neighborhood under consideration. This is the **monomial form**. It is an exact factorization of the whole function. On a sufficiently small neighborhood of a chart point, the absolute value of the nonvanishing factor is bounded above and away from zero, so

$$c\prod_j|u_j|^{a_j}\leq |F(g(u))|\leq C\prod_j|u_j|^{a_j}
\qquad(0<c\leq C<\infty).$$

Thus the coordinate powers describe the size of the function throughout the neighborhood. Different paths can still give different rates, according to how quickly their coordinates tend to zero. Later we will use these bounds, together with the Jacobian of $g$, to calculate sublevel volumes and the asymptotics of $Z_n$.

To construct such a map, we need a way to examine the remaining factor near a selected direction. A blow-up makes directions into locations on a new space, so that we can introduce local coordinates near each one and continue factoring there. The next section builds this construction explicitly in the plane.

## 3. A blow-up keeps direction attached to location

An unoriented line through the origin is represented by **homogeneous coordinates** $[s:t]$, where $(s,t)\ne(0,0)$ and

$$[s:t]=[\lambda s:\lambda t]\qquad(\lambda\ne0).$$

Thus $[s:t]$ is an equivalence class of coordinate pairs, not one numerical quotient. On the part where $s\ne0$, define the ordinary ratio coordinate $v:=t/s$; then $[s:t]=[1:v]$. This misses the valid direction $[0:1]$. On the part where $t\ne0$, use $u:=s/t$; then $[s:t]=[u:1]$. This chart instead misses $[1:0]$. Together the two charts cover $\mathbb{RP}^1$, and on their overlap $u=1/v$. In angle notation,

$$[s:t]=[\cos\theta:\sin\theta],\qquad 0\leq\theta<\pi.$$

The angle picture is especially intuitive in two dimensions. Homogeneous coordinates extend the direction variable to higher dimensions, while their affine charts separate scale from direction and expose the monomial factors used later in the asymptotic analysis.

In this example define the chosen **center** by $C:=\{0\}\subset\mathbb R^2$. The **blow-up of $\mathbb R^2$ along $C$** is the new space

$$\operatorname{Bl}_0\mathbb R^2:=\{((x,y),[s:t])\in\mathbb R^2\times\mathbb{RP}^1:xt=ys\}.$$

The equation $xt=ys$ says that $(x,y)$ lies on the line $[s:t]$. The blow-up comes with the canonical projection

$$\pi:\operatorname{Bl}_0\mathbb R^2\longrightarrow\mathbb R^2,\qquad \pi((x,y),[s:t]):=(x,y),$$

called the **blow-up morphism** or, because it collapses the new directional fiber back to the center, the **blow-down map**. Thus “blow-up” refers to the operation $\mathbb R^2\rightsquigarrow\operatorname{Bl}_0\mathbb R^2$ and its resulting space, while $\pi$ points in the opposite direction. It is an analytic isomorphism away from the center. Its inverse image of the center is

$$E:=\pi^{-1}(C)=\pi^{-1}(0)\cong\mathbb{RP}^1.$$

More generally, define the **exceptional locus** of a nontrivial blow-up by $E:=\pi^{-1}(C)$. When both the ambient space and the center are smooth, as they are here, $E$ is a smooth hypersurface of the blown-up space. Algebraic geometers traditionally call this hypersurface the *exceptional divisor*; Section 7 explains how divisor language packages hypersurfaces together with multiplicities in general principalization. Here *locus* refers only to the underlying geometric set. It lies upstairs, while its image $\pi(E)=C$ is the center downstairs. In this point blow-up, every point of $E$ maps to the origin and records a different projective direction. A direction of approach to the origin has become a distinct location upstairs.

{{< interactive-figure src="/hironaka-resolution/plane-blowup/?v=animation-latency-20260719" title="Interactive point blow-up and coordinate atlas" size="large" caption="Move the point in panel E or the direction in panel G. All three graphics describe the same point of the blow-up; setting ρ=0 moves onto the exceptional locus without losing the chosen line." >}}

The construction is covered by ordinary analytic coordinate charts. Where $s\ne0$, write $[s:t]=[1:v]$ and use coordinates $(a,v)$. In this chart, the blow-down map is

$$\pi_s(a,v):=(a,av);$$

equivalently, $x=a$ and $y=av$.

Here $a:=x$ is the first chart's signed scale and $v:=t/s$ is its affine direction coordinate. Away from the exceptional locus, $v=y/x$; unlike that quotient, the chart coordinate $v$ remains valid when $a=0$. The second chart uses $(u,b)$, with $u:=s/t$ and $b:=y$:

$$\pi_t(u,b):=(ub,b);$$

equivalently, $x=ub$ and $y=b$.

Away from the exceptional locus, $u=x/y$. On the exceptional locus, the blow-down sends every value of $u$ or $v$ to the origin, while the blown-up charts keep those values distinct. On the chart overlap, $u=1/v$ and $b=av$.

For example, define $F(x,y):=x^2+y^2$. Then

$$F(\pi_s(a,v))=a^2(1+v^2).$$

The factor $1+v^2$ never vanishes over $\mathbb R$. More generally, if $\varepsilon$ is real analytic near $q$ and $\varepsilon(q)\ne0$, then after shrinking the neighborhood it is nowhere zero and $1/\varepsilon$ is real analytic. Such a nonvanishing analytic factor is often called an **analytic unit**. It contributes neither a zero nor a vanishing order, so the pullback above is a monomial times a nonvanishing analytic factor throughout this chart.

No ordinary local diffeomorphism can achieve this. The zero set of $x^2+y^2$ is one point, whereas the zero set of a nonconstant coordinate monomial contains a coordinate hypersurface. A diffeomorphism preserves this local topology. A blow-up succeeds because it is deliberately not one-to-one over its center.

This example illustrates the monomialization mechanism; it does not mean that an ordinary regular quadratic integral needs resolution, since the second order controls every direction uniformly.

## 4. Smooth centers of arbitrary dimension: location, magnitude, and normal direction

The monomialization procedure used here consists entirely of blow-ups along **smooth** centers. This keeps the successive ambient spaces smooth and gives the exceptional locus the controlled form needed below. The center need not be a point. Let $X$ be a $d$-dimensional real-analytic manifold and let $C\subset X$ be a closed smooth real-analytic submanifold of codimension $c$. The submanifold $C$ is the **center**, which belongs to the original space $X$. The resulting space and map are written

$$\pi:\operatorname{Bl}_C X\longrightarrow X.$$

In the nontrivial case $c\geq2$, the exceptional locus is $E=\pi^{-1}(C)$, and $\pi$ restricts to an analytic isomorphism

$$\operatorname{Bl}_C X\setminus E\;\xrightarrow{\ \cong\ }\;X\setminus C.$$

Thus the blow-up changes the space only above its center. Blowing up a smooth hypersurface is locally trivial, so the nontrivial case has codimension at least two. By contrast, blowing up a singular center can produce a singular blown-up space, which is why such centers are not used in this resolution procedure.

At $p\in C$, the intrinsic normal space is the quotient

$$N_pC:=T_pX/T_pC.$$

It records transverse tangent vectors while identifying vectors that differ only by motion along $C$. No inner product is required. Because both $X$ and $C$ are smooth, these spaces form a rank-$c$ real-analytic vector bundle $N_CX$. The exceptional locus is its projectivization:

$$E\cong\mathbb P(N_CX).$$

Consequently, $E$ is a smooth real-analytic manifold of dimension

$$\dim E=\dim C+(c-1)=\dim X-1,$$

so it is a smooth hypersurface in $\operatorname{Bl}_C X$. The fiber $\pi^{-1}(p)\cong\mathbb P(N_pC)\cong\mathbb{RP}^{c-1}$ over each $p\in C$ is the set of one-dimensional normal directions at $p$. A point of the center specifies the location, while a point of its exceptional fiber specifies a normal direction there. This conclusion uses the smoothness of the ambient space as well as that of the center.

After several admissible blow-ups, each exceptional component remains smooth. At each step, admissibility means that the center has normal crossings with the exceptional components already present in the current space, as defined in Section 5. After the blow-up, their **strict transforms**—the closures of their lifts away from the new center—and the new exceptional component again have normal crossings. Their union is the **total exceptional locus**. It need not be a manifold where components intersect.

For example, let $X:=\mathbb R^3$ and let $C:=\{(s,0,0):s\in\mathbb R\}$ be an axis. Then $s$ records where a point lies along the center. The two remaining coordinates give its transverse displacement. Above every value of $s$, the blow-up retains the projective direction of that displacement even when its magnitude reaches zero.

For this straight axis, the full blow-up is the product $\mathbb R_s\times\operatorname{Bl}_0\mathbb R^2$. Each fixed-$s$ slice is an open Möbius strip. The figure shows a cut-open model of the full space alongside the selected Möbius slice. Gluing the cut faces reverses the signed displacement while keeping $s$ fixed. Its central circle is the exceptional fiber above $(s,0,0)$; all these circles together form the exceptional cylinder $E\cong\mathbb R\times\mathbb{RP}^1$.

{{< interactive-figure src="/hironaka-resolution/axis-blowup/?v=glued-slices-4" title="Interactive blow-up of an axis in three dimensions" size="large" caption="The highlighted cross-section of the cut cylinder becomes the Möbius strip when its ends are glued with a flip. Move s to select a slice; matching colors show the gluing, and the orange dot links all three views. Drag the strip to rotate it, or follow one circuit to see the twist." >}}

The same construction works locally along any smooth center: keep the coordinates along the center and blow up the transverse coordinates. Choose analytic coordinates $(y,z)\in\mathbb R^{d-c}\times\mathbb R^c$ such that $C=\{z=0\}$. A normal direction has homogeneous coordinates $[s_1:\cdots:s_c]\in\mathbb{RP}^{c-1}$. In the chart $s_1\ne0$, use

$$a:=z_1,\qquad v_j:=\frac{s_j}{s_1},\qquad z=a(1,v_2,\ldots,v_c).$$

The blow-down is $(y,a,v)\mapsto(y,a,av_2,\ldots,av_c)$, and the exceptional hypersurface is $a=0$. The coordinates $y$ select a point of the center; $v$ selects a direction above it. Other choices of a nonzero $s_i$ give the remaining charts.

To see what this does to an analytic function, expand in the transverse variables:

$$F(y,z)=\sum_{|\alpha|\geq\ell} f_\alpha(y)z^\alpha.$$

Here $|\alpha|=\alpha_1+\cdots+\alpha_c$, and we assume every term has transverse degree at least $\ell$. Under the chart substitution, each term acquires that many powers of $a$:

$$z^\alpha=a^{|\alpha|}v_2^{\alpha_2}\cdots v_c^{\alpha_c}.$$

Thus the entire pullback has a common factor,

$$F(y,a,av_2,\ldots,av_c)=a^\ell\widetilde F(y,a,v_2,\ldots,v_c),$$

with $\widetilde F$ analytic even at $a=0$. The factor $a^\ell$ records vanishing along the new exceptional hypersurface. The remaining factor carries the part of the equation still to be understood.

Where $\widetilde F$ is nonzero, this already gives a coordinate monomial times a nonvanishing analytic factor. Where it vanishes, further analysis is needed: it may supply another coordinate factor, or its zeros may still be singular or meet the exceptional hypersurface tangentially. A single blow-up extracts a common power; it does not guarantee that the remaining equation has the desired form.

Monomialization proceeds by choosing further smooth centers in the current zero set and repeating this construction. These centers must also be compatible with the exceptional hypersurfaces already introduced. The goal is to arrange all the vanishing factors as coordinate powers in a common system of local coordinates.

To state the two relevant targets precisely, we first make their common coordinate geometry explicit.

## 5. The target: normal crossings

A finite collection of embedded smooth hypersurfaces has **normal crossings at a point** if there is a real-analytic change of coordinates, invertible on a neighborhood of that point, in which every member through the point is a coordinate hyperplane simultaneously. It has **normal crossings** if this holds at every point. Embeddedness rules out self-intersections of an individual member. This is the only crossing convention used below.

We say that a smooth blow-up center $C$ has **normal crossings with the existing exceptional hypersurfaces** if, near every point of $C$, one analytic coordinate system makes $C$ a coordinate subspace and every exceptional hypersurface through that point a coordinate hyperplane. A blow-up with such a center is called **admissible**. This extends the preceding terminology to centers of arbitrary codimension. In particular, $C$ may be contained in some exceptional hypersurfaces: simultaneous coordinate compatibility, rather than ordinary transversality, is what matters.

Separately, a function has **normal-crossing monomial form** when

$$F(u)=\varepsilon(u)u_1^{N_1}\cdots u_r^{N_r},\qquad 0\leq r\leq d,$$

where $\varepsilon$ is analytic and nonzero at the point under consideration—and hence nonvanishing after shrinking the chart—and the $N_j$ are positive integers. This analytic condition is stronger than the geometric arrangement alone: the nonvanishing factor excludes hidden additional zeros, while the exponents retain the separate orders of vanishing. The hypersurfaces $u_j=0$ are smooth and their intersections are transverse.

The normal-crossing condition is stronger than merely having several smooth branches. The curves $y=0$ and $y-x^2=0$ are both embedded and smooth, but they are tangent at the origin. No analytic coordinate change can make them coordinate hyperplanes simultaneously: if both became the same coordinate hyperplane, they would coincide locally, whereas different coordinate hyperplanes have different tangent spaces. Thus the curves do not have normal crossings at the origin.

Two related goals are easy to conflate. **Embedded desingularization** concerns the geometry of the zero set: its strict transform is made smooth and arranged with the exceptional hypersurfaces in normal-crossing position. **Monomialization** concerns the equation: the full pullback is put in the displayed monomial form, so the exponents $N_j$ retain the orders of vanishing. For the asymptotic calculation below, embedded desingularization alone is therefore insufficient. We need the equation-level information supplied by the monomialization theorem in Section 7: although the total zero set may remain a normal-crossing union, both $K\circ g$ and $\lvert\det Dg\rvert$ have monomial forms whose exponents determine the rate.

Thus even after the strict transform becomes smooth, reaching embedded normal-crossing form may require more blow-ups. The cusp makes this clear.

## 6. Why one blow-up may not be enough

Consider the cusp

$$F(x,y):=y^2-x^3.$$

This is the function underlying panel C; define the nonnegative statistical loss there by $K:=F^2/2$. Monomializing $F$ automatically monomializes $K$; the same exceptional components occur, while every vanishing order doubles after squaring.

{{< interactive-figure src="/hironaka-resolution/cusp/?v=exceptional-locus-20260719" title="Interactive three-step resolution of the cusp" size="large" caption="Move t toward zero to follow the cusp through all three embedded blow-ups. In the final panel, color and the large numbers record vanishing order, the dashed blue curve is the cusp’s strict transform, and the light-gray surface is the blown-up ambient space. Switch between F and F² to see every order double." >}}

The zero set $F^{-1}(0)$ is a singular curve, so the whole curve is not a permissible center. Its singular locus is the single point $C_0:=\{(0,0)\}$, which is smooth as a zero-dimensional manifold and serves as the first center. In one chart, define the blow-down by $\pi(a,v):=(a,av)$; then

$$F(\pi(a,v))=a^2(v^2-a).$$

The blow-up has extracted $a^2$. For $a=0$ and $v\ne0$, the residual factor $v^2-a$ is nonzero, so those directions are resolved. The bad slope $v=0$ has become the point $(a,v)=(0,0)$ upstairs, where the residual factor still vanishes.

The full zero set of $F\circ\pi$ is the **total transform**. The closure of $\pi^{-1}(F^{-1}(0)\setminus\{0\})$ is the **strict transform**; here it is the smooth curve $a=v^2$. Although the strict transform is now smooth, it is tangent to the exceptional locus $a=0$, so the total transform does not yet have normal crossings. Another blow-up is required at their point of tangency.

That second blow-up removes the tangency but still does not reach the target. In its chart, the blow-down is defined by $a:=ub$ and $v:=b$, and the total transform is

$$u^2b^3(b-u).$$

The strict transform $b-u=0$, the strict transform $u=0$ of the first exceptional component, and the new exceptional component $b=0$ are three distinct curves through the origin. For the cusp parametrization $(x,y)=(t^2,t^3)$, the successive lifted coordinates are $(a,v)=(t^2,t)$ and $(u,b)=(t,t)$. Thus the first blow-up records the tangent line, while the next direction records how the slope approaches that tangent. At the remaining triple point, the three curves have directions $[0:1]$, $[1:0]$, and $[1:1]$. Three components cannot be distinct coordinate hyperplanes in a two-dimensional ambient space, so a third point blow-up separates these directions and gives normal crossings.

These are **embedded** blow-ups: at each stage it is the ambient surface that is blown up, while the cusp is replaced by its strict transform inside that surface. Thus the light-gray surface in Figure K is a schematic local model of the final blown-up ambient surface, not a model of the cusp or of the global topology of the full exceptional configuration; the cusp itself is the dashed blue strict-transform curve.

The first blow-up already makes the cusp's strict transform smooth. The second removes its tangency to the first exceptional component, and the third removes the resulting triple intersection. Thus the full sequence gives a normal-crossing total transform and monomializes $F$: in every final chart, $F\circ g$ is a nonvanishing analytic factor times a coordinate monomial. The figure shows the same resolved components for $F$ and $F^2$ and lets you switch between their vanishing orders. The constant factor $1/2$ in $K=F^2/2$ does not affect those orders.

The example shows two distinct obstructions to normal crossings: tangency after the first blow-up and too many components through one point after the second. The local computations explain why each additional blow-up is needed, but they do not by themselves prove that a suitable sequence always terminates.

## 7. The real-analytic monomialization theorem

For the integral, monomialization is the relevant form of resolution because it retains the vanishing orders of $F$; the blow-up construction also gives a monomial Jacobian. In the resolution literature, this monomialization of one function is the single-generator specialization of **principalization**. It applies whether or not $F$ changes sign. Nonnegativity of a loss $K$ is used only afterward to show that its exponents are even. Recall that a map is **proper** if inverse images of compact sets are compact.

{{< remark title="loci and divisors" >}}
In general principalization, the transformed and exceptional hypersurfaces are packaged together with their multiplicities as a divisor $D:=\sum_j N_jD_j$ supported on a normal-crossing collection; its underlying support is the locus $|D|:=\bigcup_{N_j>0}D_j$. In this single-function specialization, we discuss that locus geometrically and record the multiplicities directly in the exponents of $F\circ g$.
{{< /remark >}}

The following statement is a compact-neighborhood consequence of the cited results, not a verbatim theorem from one source. Items 1--3 come from the single-function case of Bierstone and Milman's results; item 4 is the elementary Jacobian consequence proved immediately afterward.

{{< theorem title="Real-analytic monomialization" >}}
Let $X$ be a $d$-dimensional real-analytic manifold, let $V\subset X$ be an open neighborhood of a compact set $Q$, and let $F$ be real analytic on $V$. Assume that $F$ is not identically zero on any connected component of $V$ meeting $Q$. Then there are an open set $U$ with $Q\subset U\subset V$, a $d$-dimensional real-analytic manifold $M$, and a proper surjective real-analytic map $g:M\to U$ such that:

1. $g$ is a finite composition of admissible blow-ups with closed smooth real-analytic centers; each center is contained in the current total transform of $F^{-1}(0)$ and has normal crossings with the existing exceptional hypersurfaces;
2. $g$ restricts to an analytic isomorphism from $M\setminus g^{-1}(F^{-1}(0))$ onto $U\setminus F^{-1}(0)$;
3. near every $q\in M$, there are analytic coordinates $u:=(u_1,\ldots,u_d)$ with $u(q)=0$, nonnegative integers $N_j$, and an analytic factor $\varepsilon$ with $\varepsilon(q)\ne0$ for which

   $$F(g(u))=\varepsilon(u)\prod_{j=1}^d u_j^{N_j};$$

4. At every $q\in M$, the coordinates $u$ in item 3 may be chosen so that, for analytic coordinates $x:=(x_1,\ldots,x_d)$ on $U$ near $g(q)$,

   $$\det\frac{\partial(x_1\circ g,\ldots,x_d\circ g)}{\partial(u_1,\ldots,u_d)} =\eta(u)\prod_{j=1}^d u_j^{J_j},$$

   where $J_j$ are nonnegative integers and $\eta$ is analytic with $\eta(q)\ne0$. A positive exponent $J_j$ can occur only when $\{u_j=0\}$ is an exceptional hypersurface.
{{< /theorem >}}

Because every center lies in the current total transform, the total exceptional locus satisfies
$$E_{\mathrm{tot}}\subseteq(F\circ g)^{-1}(0).$$
In the coordinates of item 3 near any $q \in M$,
$$(F\circ g)^{-1}(0)=\bigcup_{N_j>0}\{u_j=0\}$$
is a normal-crossing union of coordinate hyperplanes.

Item 4 is the **monomial Jacobian property**. It is independent of whether $F$ is nonnegative. Taking absolute values gives the coordinate-density formula

$$g^*\lvert dx_1\cdots dx_d\rvert
=b(u)\prod_{j=1}^d\lvert u_j\rvert^{J_j}\lvert du_1\cdots du_d\rvert,$$

where $b:=\lvert\eta\rvert$ is positive and analytic after restricting to a connected coordinate neighborhood. For the displayed coordinate hyperplanes, the integers $J_j$ are uniquely determined, and item 4 implies $J_j=0$ whenever $\{u_j=0\}$ is not exceptional. More intrinsically, each exceptional component carries a coordinate-independent exponent.

{{< remark title="why componentwise orders are intrinsic" >}}
Let $h$ be real analytic near a connected smooth hypersurface component $H$. On a coordinate neighborhood meeting $H$, choose analytic coordinates

$$u:=(z,w)=(z,w_2,\ldots,w_d),\qquad H=\{z=0\},$$

where $z$ is transverse to $H$ and $w$ collects the coordinates along it. Analyticity gives

$$h(z,w)=\sum_{r=0}^{\infty}a_r(w)z^r,\qquad \operatorname{ord}_H(h):=\min\{r\geq0:a_r\not\equiv0\}.$$

If $h$ is identically zero, set $\operatorname{ord}_H(h):=\infty$. Otherwise, this is equivalently the unique exponent $r$ for which

$$h(z,w)=z^rA(z,w),\qquad A(0,w)\not\equiv0.$$

Another analytic coordinate defining $H$ differs from $z$ by a nonvanishing analytic factor, and multiplying $h$ by such a factor does not change $r$. Thus the order is intrinsic to the hypersurface component.

For a local coordinate expression $G:=(G_1,\ldots,G_d)$ of a real-analytic map between $d$-dimensional manifolds, define

$$\operatorname{Jac}(G):=\det\left(\frac{\partial G_i}{\partial u_j}\right)_{i,j=1}^d.$$

This determinant is real analytic because derivatives of analytic functions are analytic. Changing source or target coordinates multiplies it by a nonvanishing analytic factor, so $\operatorname{ord}_H(\operatorname{Jac}(G))$ is independent of those choices. A composition of blow-ups is an analytic isomorphism off its exceptional locus, so its Jacobian is not identically zero. Passing to its absolute value in the coordinate-density formula does not change its componentwise order.
{{< /remark >}}

{{< proof title="monomial Jacobian property" >}}
The local calculation for one blow-up explains the result. If a center has codimension $c$ and is given locally by $x_1=\cdots=x_c=0$, then one blow-up chart has

$$x_1=u_1,\qquad x_i=u_1u_i\ (2\leq i\leq c),\qquad x_i=u_i\ (i>c),$$

and hence

$$\det\frac{\partial(x_1,\ldots,x_d)}{\partial(u_1,\ldots,u_d)}=u_1^{c-1}.$$

For a composition of such blow-ups, the chain rule multiplies these factors. Because every center has normal crossings with the exceptional hypersurfaces already present, the previously accumulated exceptional factors pull back to coordinate monomials. Their product is therefore a nonvanishing analytic factor times $\prod_j u_j^{J_j}$.
{{< /proof >}}

Here is the precise attribution. Bierstone and Milman state [Theorem 1.10 (pp. 216--17)](https://doi.org/10.1007/s002220050141) for ideals because an ideal packages several local equations and their common vanishing orders without depending on which functions are chosen to generate it, making it the natural input for a canonical resolution algorithm. Specialized to the ideal generated by the single function $F$, the theorem gives a finite sequence on a quasi-compact manifold after which the remaining factor is nowhere zero and the total pullback is locally a nonvanishing analytic factor times a coordinate monomial. The sentence immediately following the theorem gives the corresponding normal-crossing statement after including the Jacobian determinant. Theorem 2.4 (p. 229) explicitly records properness and surjectivity, both inherited from the blow-ups: the map covers the original region, and compact sets have compact preimages, allowing a finite chart cover for integration. In addition to requiring the center to have normal crossings with the existing exceptional hypersurfaces, equation (1.2) (p. 213) requires the resolution invariant to be locally constant along the center. That extra algorithmic condition is not needed in the existence statement above. In the algorithm the centers lie where the not-yet-monomialized factor still vanishes, so they lie over $F^{-1}(0)$ and the composite is unchanged away from that set.

Theorem 13.4 (pp. 298--99) is itself a desingularization theorem for a noncompact analytic space, not a monomialization theorem for a function. Immediately after its statement, however, the authors explicitly say that its proof also extends Theorem 1.10 to the noncompact analytic case. Applied to $F$, that extension gives a locally finite monomialization sequence. By their definition of local finiteness on pp. 298--99, only finitely many blow-ups are nontrivial over a fixed compact set. Restricting to a relatively compact neighborhood of $Q$ therefore yields the finite compact-neighborhood statement above. The displayed Jacobian formula is then supplied by the elementary chart calculation, rather than quoted as part of Theorem 13.4.

Avoiding points that already have normal crossings is a refinement of embedded desingularization, not part of the monomialization conclusion just cited. For hypersurfaces, [Bierstone and Milman (2012), Theorem 3.4](https://doi.org/10.1016/j.aim.2012.08.002) gives an embedded blow-up sequence that is an isomorphism over the existing normal-crossing locus in the convention used here; their introduction notes the corresponding analytic version. This refinement is geometrically useful but is not needed for the integral: the proper monomialization and monomial Jacobian formulas above suffice.

For a nonnegative loss such as $K$, the following consequence is useful.

{{< theorem kind="Corollary" title="Nonnegative analytic functions" >}}
In addition to the assumptions above, suppose $F=K$ and $K\geq0$ throughout the open set $V$. Then every monomialization chart has the form
$$K(g(u))=\varepsilon(u)\prod_{j=1}^d u_j^{2k_j},$$
where the $k_j$ are nonnegative integers and $\varepsilon$ is positive and analytic. At any point $q\in(K\circ g)^{-1}(0)$, a further invertible local analytic coordinate change can absorb $\varepsilon$, giving
$$K(g(u))=\prod_{j=1}^d u_j^{2k_j}.$$
{{< /theorem >}}

{{< proof title="nonnegative analytic corollary" >}}
To see why the exponents are even, choose coordinates sending the point to the origin and shrink to a symmetric coordinate box on which the unit $\varepsilon$ has constant sign. If some exponent $N_j$ were odd, changing the sign of $u_j$ while keeping the other coordinates nonzero would change the sign of $K\circ g$, contradicting $K\geq0$. Thus every $N_j=2k_j$. The monomial is then positive away from its coordinate hyperplanes, so $\varepsilon$ must be positive. At a point $q\in(K\circ g)^{-1}(0)$, choose an index $j$ for which $k_j>0$ and $u_j(q)=0$. The positive analytic root $\varepsilon^{1/(2k_j)}$ exists locally, and replacing $u_j$ by $u_j\varepsilon(u)^{1/(2k_j)}$ is an invertible analytic coordinate change that absorbs the unit. This change has nonvanishing Jacobian, so it changes only the nonvanishing density factor $\eta$ in the coordinate-density formula, not the exponents $J_j$.
{{< /proof >}}

The assumption that $K$ is nonnegative on an **open neighborhood** is essential. If the parameter domain contains only one side of a coordinate hypersurface, an odd power need not change sign on the domain: for example, $K(u):=u$ is nonnegative on $u\geq0$. Such boundary problems must retain the domain inequalities and are not covered by the even-power conclusion.

Properness ensures that the part of the resolved space above $Q$ is compact and can therefore be covered by finitely many coordinate charts, allowing local monomial calculations to be assembled into one integral.

At an intermediate stage $g_i:M_i\to U$, define $F_i:=F\circ g_i$. The next center is a smooth submanifold

$$C_i\subset F_i^{-1}(0)=g_i^{-1}(F^{-1}(0)).$$

Every center therefore lies over the original zero set, but it is generally only a carefully selected part of the current geometry. The zero set $F_i^{-1}(0)$ may itself be singular; only the selected center $C_i$ is required to be smooth.

The theorem is constructive, not merely existential. Hironaka's method and its later analytic formulations recursively compute a refined invariant of the unresolved singularity, select a smooth center inside its worst locus, and update the invariant after blowing up. The difficult part is proving that this process terminates: the invariant decreases in a well-founded ordering, so only finitely many steps are needed over a neighborhood of the chosen compact set. Thus the centers are prescribed by a resolution algorithm rather than guessed. Separating location, magnitude, and direction explains geometrically what each step accomplishes; the invariant certifies that the iteration must end.

Here “algorithm” is meant in the mathematical sense of a recursive rule. Turning it into computer algebra also requires a finite exact representation of the input and the necessary analytic operations; an arbitrary analytic function given only through an infinite power series is not automatically an effective finite input.

## 8. Why direction matters to the integral

For large $n$, the integral concentrates near $K=0$, with the characteristic loss scale $K(w)\asymp1/n$:

$$Z_n=\int e^{-nK(w)}\varphi(w)\,dw.$$

Suppose first that $p$ is an isolated zero. In two dimensions, represent a projective direction by an angle $0\leq\theta<\pi$ and use a signed scale $-\delta < a < \delta$:

$$w:=p+a(\cos\theta,\sin\theta).$$

The angle chooses an unoriented line, while the sign of $a$ chooses the side of that line. Away from $a=0$, these coordinates represent every point of the punctured ball exactly once. The local integral is therefore

$$Z_{n,p}:=\int_0^\pi\int_{-\delta}^{\delta}e^{-nK(p+a(\cos\theta,\sin\theta))}\varphi(p+a(\cos\theta,\sin\theta))\lvert a\rvert\,da\,d\theta.$$

For $a\ne0$, the point $w$ still determines its projective direction. The collapse occurs only in the location limit $a\to0$, which sends every value of $\theta$ to $p$; the projective blow-up instead retains these values as distinct points above $p$. In $d$ dimensions, the same construction uses the projective lines $[\omega]\in\mathbb{RP}^{d-1}$ and a signed coordinate $a$ along each line. It is globally the tautological line bundle rather than a product, but in every projective chart the volume element has the form $\lvert a\rvert^{d-1}da$ times a smooth angular factor.

Choose either unit representative $\omega$ of $[\omega]$; replacing $\omega$ by $-\omega$ and $a$ by $-a$ leaves the represented point unchanged. Because $K$ is nonnegative and analytic near $p$, its first nonzero Taylor degree $\ell$ is even, so its leading coefficient is also independent of that choice. If, uniformly in projective direction,

$$K(p+a\omega)=c([\omega])a^\ell+O(\lvert a\rvert^{\ell+1}),\qquad c([\omega])\geq c_0>0,$$

then every line has the same signed radial scale $\lvert a\rvert\asymp n^{-1/\ell}$. To convert this linewise scale into $d$-dimensional volume, define $z:=w-p$ and rescale each Cartesian coordinate by $z_j:=n^{-1/\ell}v_j$, $j=1,\ldots,d$. Each substitution contributes $n^{-1/\ell}$, so

$$dz=\prod_{j=1}^d dz_j
=\prod_{j=1}^d\left(n^{-1/\ell}dv_j\right)
=n^{-d/\ell}\,dv.$$

Thus $d$ appears because all $d$ displacement coordinates shrink at the same scale; uniform positivity of $c([\omega])$ makes the remaining rescaled integral affect only the leading constant when $\varphi(p)>0$.

The singular case begins when the leading coefficient $c([\omega])$ vanishes on some projective lines. An individual line still has angular measure zero, but angular neighborhoods around it may contain points for which $K$ rises much more slowly. Their angular width and signed radial depth then shrink together, and their joint volume can change the power of $n$.

For example, let

$$K(x,y):=x^2+y^4.$$

Near the vertical projective direction, define $\alpha:=\theta-\pi/2$, so that $\theta=\pi/2+\alpha$. For small $a$ and $\alpha$,

$$K(a,\alpha):=K(a\cos\theta,a\sin\theta)
=a^2\cos^2\theta+a^4\sin^4\theta\asymp a^2\alpha^2+a^4.$$

To keep $nK$ of order one near this direction, $na^4\asymp1$ first gives $\lvert a\rvert\asymp n^{-1/4}$; substituting this into $na^2\alpha^2\asymp1$ then gives $\lvert\alpha\rvert\asymp n^{-1/4}$. Because the projective-polar area element is $\lvert a\rvert\,da\,d\alpha$, their joint contribution has order $n^{-3/4}$. Equivalently, in Cartesian coordinates the scales are $x\asymp n^{-1/2}$ and $y\asymp n^{-1/4}$, again giving area $n^{-3/4}$. Thus restricting the Taylor expansion to a projective direction is only a diagnostic: the integral depends on the full signed-radial and angular behavior near that line.

## 9. Why the monomial form is calculable

As in the standing assumptions, set aside any open component on which $K\equiv0$: its contribution is the constant $\int\varphi$, rather than a decaying term. Near a remaining transformed zero $q$, choose resolved coordinates $u$ with $u(q)=0$. Use the invertible analytic adjustment from Section 7 to absorb the positive unit in $K\circ g$. The adjustment has nonvanishing Jacobian, which is absorbed into $b$ without changing either exponent vector, so

$$K(g(u))=\prod_{j=1}^d u_j^{2k_j},
\qquad
\lvert\det Dg(u)\rvert=b(u)\prod_{j=1}^d\lvert u_j\rvert^{J_j},$$

where $b>0$ is analytic and $k_j,J_j$ are nonnegative integers. Every local approach is still represented in the resolved charts. In particular, along a power-law path with $\lvert u_j(s)\rvert\asymp s^{\alpha_j}$,

$$K(g(u(s)))\asymp s^{2\sum_jk_j\alpha_j}.$$

Thus the directional dependence is now explicit in the coordinate-wise rates. The local zero set is the union of the hyperplanes $\{u_j=0\}$ with $k_j>0$; coordinates with $k_j=0$ are flat for this local calculation.

Properness makes $C:=g^{-1}(\operatorname{supp}\varphi)$ compact. For each $q\in C\cap(K\circ g)^{-1}(0)$, choose a coordinate neighborhood $U_q$ with $u(q)=0$, small enough that **all zero-set components meeting $U_q$ pass through $q$**. In these coordinates, their local pieces are simultaneously coordinate hyperplanes. Compactness gives a finite cover of $C\cap(K\circ g)^{-1}(0)$ by these neighborhoods. If any part of $C$ remains outside their union, it is compact and disjoint from $(K\circ g)^{-1}(0)$; cover it by finitely many additional coordinate neighborhoods on which $K\circ g$ is bounded away from zero.

On a neighborhood of $C$, choose a nonnegative partition of unity $\{\chi_\alpha\}_{\alpha=1}^N$ with each support compactly contained in its chart. The zero set upstairs is locally a finite union of coordinate hyperplanes, so it has zero $d$-dimensional volume. Its image downstairs also has zero volume because $g$ is locally Lipschitz. Since $g$ is an analytic isomorphism off these sets, change of variables gives

$$Z_n=\sum_{\alpha=1}^N I_{n,\alpha},\qquad
I_{n,\alpha}:=\int \exp\left(-nK(g_\alpha(u))\right)
\psi_\alpha(u)\prod_{j=1}^d\lvert u_j\rvert^{J_{\alpha j}}\,du,$$

where $g_\alpha$ denotes $g$ in the chart's coordinates and $\psi_\alpha\geq0$ is continuous and compactly supported; it contains $\varphi\circ g_\alpha$, the nonvanishing Jacobian factor, and $\chi_\alpha$. The partition functions only localize the integral: the rate data belong to the hypersurface components of $(K\circ g)^{-1}(0)$ and to their intersections, not to the partition functions themselves. A summand whose support does not meet $(K\circ g)^{-1}(0)$ is exponentially small and can be set aside.

Fix one remaining localized chart contribution and suppress its partition index. Its reference point $q$ has coordinates $u=0$, and $K(g(u))=\prod_j u_j^{2k_j}$ as above. Extend the compactly supported factor $\psi$ by zero outside its coordinate domain. The calculation below always gives an upper bound; when $\psi(0)>0$, it gives the matching lower bound. Write

$$d\mu(u):=\psi(u)\prod_{j=1}^d\lvert u_j\rvert^{J_j}\,du,
\qquad
V(\varepsilon):=\mu\{u:K(g(u))\leq\varepsilon\}.$$

Integrating out the $k_j=0$ coordinates, including their weights $\lvert u_j\rvert^{J_j}$, produces another bounded continuous factor, still denoted by $\psi$. It remains positive at the origin whenever the original localized factor is positive there, so under this positivity condition the flat coordinates affect only constants. Hence let $I:=\{j:k_j>0\}$ and work with these nonflat coordinates; $I$ is nonempty because $K(g(0))=0$.

For each $\sigma\in\{-1,+1\}^I$, define the corresponding sign region

$$\mathcal O_\sigma:=\{u:\operatorname{sign}(u_j)=\sigma_j\text{ for every }j\in I\}.$$

On $\mathcal O_\sigma$, introduce logarithmic coordinates by

$$t_j:=-\log\lvert u_j\rvert,$$

so that $u_j=\sigma_je^{-t_j}$. Set

$$a_j:=2k_j,\qquad b_j:=J_j+1,$$

and define the linear forms

$$A(t):=\sum_{j\in I}a_jt_j,\qquad
B(t):=\sum_{j\in I}b_jt_j.$$

Let $\psi_\sigma(t):=\psi((\sigma_je^{-t_j})_{j\in I})$ denote the continuous factor after this substitution. Then $K\circ g=e^{-A(t)}$ and the monomial volume element is $e^{-B(t)}dt$. Choose fixed $T_j$ so that $\lvert u_j\rvert\leq e^{-T_j}$ throughout the localized support. If $\varepsilon:=e^{-L}$, the contribution of a sign region is

$$V_\sigma(e^{-L})
:=\int_{\{t_j\geq T_j,\ A(t)\geq L\}}
e^{-B(t)}\psi_\sigma(t)\,dt.$$

The coordinate hyperplanes have measure zero, so $V(e^{-L})=\sum_\sigma V_\sigma(e^{-L})$. This is the key linearization: the sublevel condition and volume cost have become linear.

For the upper bound, compact support makes every $\psi_\sigma$ bounded, and the finitely many sign regions can be dominated by one outer tail $t\geq T$. For the lower bound when the localized factor is positive at the origin, continuity gives $c>0$ on a product neighborhood there. Its intersection with any fixed sign region $\sigma_0$ becomes an inner tail $t\geq T'\geq T$. Thus, for all sufficiently large $L$,

$$
c\int_{\substack{t\geq T'\\A(t)\geq L}}e^{-B(t)}\,dt
\;\leq\;V_{\sigma_0}(e^{-L})
\;\leq\;V(e^{-L})
=\sum_\sigma V_\sigma(e^{-L})
\;\leq\;
C\int_{\substack{t\geq T\\A(t)\geq L}}e^{-B(t)}\,dt.
$$

Because $\varepsilon\downarrow0$ means $L\to\infty$, define the optimal volume cost

$$F_T(L):=\inf\{B(t):t_j\geq T_j,\ A(t)\geq L\}.$$

Smaller $B(t)$ means larger volume density $e^{-B(t)}$. Set

$$\lambda:=\min_{j\in I}\frac{b_j}{a_j},$$

and $C_T:=\sum_{i\in I}(b_i-\lambda a_i)T_i$. Since

$$B(t)-\lambda A(t)
=\sum_{i\in I}(b_i-\lambda a_i)t_i\geq C_T,$$

we have $F_T(L)\geq\lambda L+C_T$. Conversely, if $j_*$ attains the minimum, take $t_i=T_i$ for $i\ne j_*$ and choose $t_{j_*}$ so that $A(t)=L$. For all sufficiently large $L$ this is feasible and attains the lower bound. Hence

$$F_T(L)=\lambda L+C_T\quad\text{for all sufficiently large }L,
\qquad
\lambda=\lim_{L\to\infty}\frac{F_T(L)}{L}.$$

The inner bounds define a different optimization problem, but if $s:=T'-T$, translation gives the exact relation

$$F_{T'}(L)=B(s)+F_T\bigl(L-A(s)\bigr)
=\lambda L+C_{T'}$$

for all sufficiently large $L$.

Thus the outer and inner problems have different feasible sets and bounded intercepts but the same asymptotic slope.

{{< interactive-figure src="/hironaka-resolution/linear-bounds/?v=linear-bounds-6" title="Interactive upper and lower logarithmic optimization bounds" size="large" caption="Move L to see which part of the fixed transformed support satisfies the sublevel constraint. The outer and inner tails give different feasible optimization problems whose optimal costs have the same asymptotic slope." >}}

Let

$$M_\lambda:=\left\{j\in I:\frac{b_j}{a_j}=\lambda\right\},
\qquad m:=\lvert M_\lambda\rvert.$$

The logarithmic power comes from this tie. For the outer tail, the substitution $x_j:=a_j(t_j-T_j)$ gives the exact identity

$$
\int_{\substack{t_j\geq T_j\\A(t)\geq L}}e^{-B(t)}\,dt
=\frac{e^{-B(T)}}{\prod_{j\in I}a_j}
\int_{\substack{x_j\geq0\\\sum_{j\in I}x_j\geq L-A(T)}}
\exp\left(-\sum_{j\in I}\frac{b_j}{a_j}x_j\right)dx.
$$

The same identity holds with $T'$ for the inner tail. Its prefactor and the shifts $A(T),A(T')$ are fixed independently of $L$, so they affect only multiplicative constants in the asymptotic comparison. For the outer tail, set $H:=L-A(T)$; then $H\to\infty$ with $L$.

Relabel the $m$ minimizing coordinates as $1,\ldots,m$. To integrate these coordinates, put $s:=x_1+\cdots+x_m$ and normalize each slice by $p_j:=x_j/s$ for $j\lt m$, with $p_m:=1-\sum_{j\lt m}p_j$. Then $p$ ranges over the fixed coordinate simplex

$$\Delta_{m-1}:=\left\{p_j\geq0:\sum_{j\lt m}p_j\leq1\right\},$$

the Jacobian is $s^{m-1}$, and $\operatorname{vol}(\Delta_{m-1})=1/(m-1)!$. Thus, for $h\geq0$, define

$$
G_m(h):=\int_{\substack{x_1,\ldots,x_m\geq0\\x_1+\cdots+x_m\geq h}}
e^{-\lambda(x_1+\cdots+x_m)}\,dx_1\cdots dx_m
=\frac1{(m-1)!}\int_h^\infty e^{-\lambda s}s^{m-1}\,ds.
$$

Repeated integration by parts gives the exact expression

$$G_m(h)
=e^{-\lambda h}\sum_{r=0}^{m-1}\frac{h^r}{r!\lambda^{m-r}}
\asymp e^{-\lambda h}(1+h^{m-1}).$$

If $M_\lambda=I$, then $G_m(H)$ is the full integral. Otherwise, let $I_{>}:=I\setminus M_\lambda$ index the nonminimizing coordinates and set

$$y:=(x_j)_{j\in I_{>}},\qquad
q_j:=\frac{b_j}{a_j}>\lambda,\qquad
R(y):=\sum_{j\in I_{>}}x_j,\qquad
Q(y):=\sum_{j\in I_{>}}q_jx_j.$$

For fixed $y$, the minimizing coordinates must contribute at least $(H-R(y))_+:=\max\{H-R(y),0\}$ to the constraint. Fubini's theorem therefore writes the full integral exactly as

$$\int_{y\geq0}e^{-Q(y)}G_m\bigl((H-R(y))_+\bigr)\,dy.$$

Split this integral according to whether the nonminimizing coordinates meet the threshold by themselves:

$$
=\int_{\{R(y)\leq H\}}e^{-Q(y)}G_m\bigl(H-R(y)\bigr)\,dy
+G_m(0)\int_{\{R(y)>H\}}e^{-Q(y)}\,dy.
$$

This decomposition shows why the additional coordinates do not change the rate. On the first region, the explicit formula for $G_m$ makes the integrand at most

$$C_{\lambda, m} e^{-\lambda H}(1+H^{m-1})
\exp\left(-\sum_{j\in I_{>}}(q_j-\lambda)x_j\right),$$

whose $y$-integral is finite because every $q_j-\lambda>0$. In the second integral, $Q(y)\geq(\lambda+\delta)R(y)$ for some $\delta>0$. Retaining half this gap to make the remaining integral finite gives

$$\int_{\{R(y)>H\}}e^{-Q(y)}\,dy
\leq e^{-(\lambda+\delta/2)H}\int_{y\geq0}e^{-\delta R(y)/2}\,dy
=\left(\frac2\delta\right)^{\lvert I_{>}\rvert}e^{-(\lambda+\delta/2)H},$$

which is exponentially smaller than $e^{-\lambda H}H^{m-1}$. Conversely, restricting the first integral to a fixed box of positive volume in $y$ keeps $R(y)$ and $Q(y)$ bounded and gives a matching lower bound for large $H$. Hence the nonminimizing coordinates change only the multiplicative constant. When $\psi(0)>0$, the upper and lower comparisons yield

$$V(\varepsilon)\asymp
\varepsilon^\lambda\left(\log\frac1\varepsilon\right)^{m-1}
\qquad(\varepsilon\downarrow0).$$

For example, for $0<\varepsilon\leq1$, on $[-1,1]^2$,

$$\operatorname{vol}\{u^2v^2\leq\varepsilon\}
=4\sqrt\varepsilon\left(1+\frac12\log\frac1\varepsilon\right),$$

so $(\lambda,m)=(1/2,2)$. For $u^2v^4$, the ratios are $1/2$ and $1/4$, giving $(\lambda,m)=(1/4,1)$ and no logarithm.

### From volume to the integral

We can now use this sublevel-volume rate to determine the asymptotic rate of the exponentially weighted integral $Z_n$ as $n\to\infty$. Let $\nu:=(K\circ g)_*\mu$. This is a finite measure, $V(s)=\nu([0,s])$, and the resolved zero set has $\mu$-measure zero, so $V(0)=0$. The boundary terms therefore vanish, and integration by parts followed by the substitution $z:=ns$ gives

$$I_n=\int_0^\infty e^{-ns}\,d\nu(s)
=n\int_0^\infty e^{-ns}V(s)\,ds
=\int_0^\infty e^{-z}V(z/n)\,dz.$$

The kernel thus probes $V$ at scale $1/n$. When $\psi(0)>0$, the sublevel estimate supplies $c,C>0$ and $0\lt\delta\lt1$ such that, for $0\lt s\leq\delta$,

$$c\,s^\lambda\left(\log\frac1s\right)^{m-1}
\leq V(s)\leq
C\,s^\lambda\left(\log\frac1s\right)^{m-1}.$$

Restricting the $z$-integral to $1\leq z\leq2$ gives the lower bound

$$I_n\geq c_1n^{-\lambda}(\log n)^{m-1}$$

for all sufficiently large $n$.

For the upper bound, the part $z\geq\delta n$ is $O(e^{-\delta n})$ because $V$ is bounded. Combining with the upper sublevel estimate on $0\lt z\leq\delta n$ gives

$$I_n\leq C_1n^{-\lambda}
\int_0^{\delta n}e^{-z}z^\lambda
\left(\log\frac nz\right)^{m-1} dz
+C_2e^{-\delta n}.$$

Splitting at $z=1$, use $\log(n/z)=\log n+\log(1/z)$ below $1$ and $\log(n/z)\leq\log n$ above it. The facts

$$\int_0^1z^\lambda\left(\log\frac1z\right)^{m-1} dz<\infty,
\qquad
\int_1^\infty e^{-z}z^\lambda\,dz<\infty$$

then bound the remaining integral by $O((\log n)^{m-1})$. Hence this localized contribution satisfies

$$I_n^{\mathrm{loc}}\asymp n^{-\lambda}(\log n)^{m-1}\qquad(n\to\infty)$$

when its continuous factor is positive at the coordinate origin. Without that positivity, the same calculation gives only the corresponding upper bound.

Here the rate data have an intrinsic geometric interpretation. Let $\mathcal D$ be the finite collection of hypersurface components of $(K\circ g)^{-1}(0)$ that meet the resolved region of interest. These are exceptional components and hypersurface components of the final strict transform. For every $D\in\mathcal D$, define

$$a_D:=\operatorname{ord}_D(K\circ g),\qquad
J_D:=\operatorname{ord}_D(\operatorname{Jac}(g)),\qquad
\lambda_D:=\frac{J_D+1}{a_D}.$$

To calculate these quantities for a particular component, choose a point $q\in D$ at which the residual factors are nonzero and a local defining coordinate $z$ with $D=\{z=0\}$. If

$$K\circ g=z^{a_D}\alpha,\qquad \operatorname{Jac}(g)=z^{J_D}\beta,
\qquad \alpha(q)\beta(q)\ne0,$$

then the displayed exponents are precisely $a_D$ and $J_D$. Such a point exists because the residual factors in the definition of componentwise order are not identically zero on $D$.

The global comparison no longer depends on the chosen point or chart. Recall the compact resolved support $C:=g^{-1}(\operatorname{supp}\varphi)$. Retain every component that meets $C$, including those along which the amplitude vanishes:

$$\mathcal D_C:=\{D\in\mathcal D:D\cap C\ne\varnothing\}.$$

If this collection is empty, the integral is exponentially small. Otherwise, let

$$\lambda_*:=\min_{D\in\mathcal D_C}\lambda_D,
\qquad
\mathcal D_*:=\{D\in\mathcal D_C:\lambda_D=\lambda_*\}.$$

The logarithmic multiplicity is the largest number of minimizing components that meet on the resolved support:

$$m_*:=\max\left\{\lvert S\rvert:
S\subseteq\mathcal D_*,\quad
\left(\bigcap_{D\in S}D\right)\cap C\ne\varnothing
\right\}.$$

{{< remark title="Positivity condition" >}}
At least one intersection attaining $m_*$ must contain a point $q\in C$ with $\varphi(g(q))>0$. This is a sufficient condition for the rate below; continuity alone is not enough. If it fails, the amplitude's vanishing may change the rate and must be analyzed separately.
{{< /remark >}}

The choice of coordinate neighborhoods makes the upper bound precise. All zero-set components meeting a given neighborhood pass through its reference point $q_\alpha\in C$, so its local minimum satisfies $\lambda_\alpha\geq\lambda_*$. If equality holds, the number of minimizing components is at most $m_*$; if $\lambda_\alpha>\lambda_*$, the extra power of $n$ absorbs any fixed power of $\log n$. Thus every localized contribution has the global upper bound, including near zeros of the amplitude. Components whose intersection misses $C$ cannot add logarithmic factors jointly.

For the lower bound, choose the point $q$ in the positivity condition and a small resolved coordinate neighborhood with $u(q)=0$. Localize with a nonnegative cutoff, bounded by $1$, supported there and positive at $q$. The localized continuous factor is positive at the origin, the local rate is $(\lambda_*,m_*)$, and this integral is bounded above by $Z_n$. The matching local lower bound therefore gives

$$Z_n\asymp n^{-\lambda_*}(\log n)^{m_*-1}.$$

Thus the slowest-decaying component ratio wins; where several minimizing components meet, their number produces the logarithmic multiplicity. The resulting $\lambda_*$ is usually called the **real log canonical threshold** or **learning coefficient**, and $m_*$ its multiplicity. Their broader statistical interpretation belongs to singular learning theory (Watanabe 2009).

### Returning to the cusp

{{< cusp-sticky-start >}}

{{< cusp-chart-reminder >}}

The calculation uses several copies of $\mathbb R^2$ as **coordinate domains**; these should not be confused with the blown-up surfaces themselves. Define $X_0:=\mathbb R^2$ to be the original ambient plane, let $X_i$ be the ambient surface after $i$ blow-ups, and write $\pi_i:X_i\to X_{i-1}$ for the $i$th individual blow-down:

$$X_3\xrightarrow{\pi_3}X_2\xrightarrow{\pi_2}X_1\xrightarrow{\pi_1}X_0.$$

Choose open sets $U_1,U_2,U_{3,c},U_{3,r}\subset\mathbb R^2$ and four chart parametrizations, real-analytic diffeomorphisms onto open subsets of the indicated surfaces:

$$\kappa_1:U_1\to X_1,\qquad
\kappa_2:U_2\to X_2,\qquad
\kappa_{3,c}:U_{3,c}\to X_3,\qquad
\kappa_{3,r}:U_{3,r}\to X_3.$$

Their input coordinates are respectively $(a,v)$, $(u,b)$, $(c,d)$, and $(r,e)$. Each $\kappa$ sends a numerical coordinate pair into the indicated manifold; equivalently, it is the inverse of a chart map from that manifold to an open subset of $\mathbb R^2$. The images of $\kappa_1$ and $\kappa_2$ are only the selected charts containing the lifted cusp and the next blow-up center, not all of $X_1$ or $X_2$. On the relevant chart domains, the individual blow-downs have the Euclidean coordinate representations

$$\begin{aligned}
(\pi_1\circ\kappa_1)(a,v)&=(a,av),\\
(\kappa_1^{-1}\circ\pi_2\circ\kappa_2)(u,b)&=(ub,b),\\
(\kappa_2^{-1}\circ\pi_3\circ\kappa_{3,c})(c,d)&=(c,cd),\\
(\kappa_2^{-1}\circ\pi_3\circ\kappa_{3,r})(r,e)&=(re,e).
\end{aligned}$$

The last two lines are two coordinate representations of the same map $\pi_3:X_3\to X_2$, not two different blow-down maps.

The cusp now closes the loop between the geometry and the integral. Write $S'''$ for the final strict transform and $E_1'',E_2',E_3$ for the three exceptional components. Define the total exceptional locus by $E_{\mathrm{exc}}:=E_1''\cup E_2'\cup E_3$, but take each order below along one component at a time.

Using the componentwise vanishing order defined in Section 7, we can now read the orders of $F\circ g$ and the Jacobian directly from the final chart formulas. This definition applies to each smooth component separately; it does not require the full transformed zero set to be in normal-crossing position.

The final monomialization map back to the original plane is

$$g:=\pi_1\circ\pi_2\circ\pi_3:X_3\to X_0.$$

Composing the displayed chart formulas gives, in the $\kappa_{3,c}$-chart,

$$\begin{aligned}
(g\circ\kappa_{3,c})(c,d)&=(c^2d,c^3d^2),\\
(F\circ g\circ\kappa_{3,c})(c,d)&=c^6d^3(d-1), \\
\left\lvert\operatorname{Jac}(g\circ\kappa_{3,c})(c,d)\right\rvert
&=\lvert c\rvert^4\lvert d\rvert^2.
\end{aligned}$$

The $\kappa_{3,c}$-chart contains $E_3=\{c=0\}$, $E_2'=\{d=0\}$, and $S'''=\{d=1\}$. The remaining component $E_1''$ appears in the companion $\kappa_{3,r}$-chart, where

$$\begin{aligned}
(g\circ\kappa_{3,r})(r,e)&=(re^2,re^3),\\
(F\circ g\circ\kappa_{3,r})(r,e)&=r^2e^6(1-r),\\
\left\lvert\operatorname{Jac}(g\circ\kappa_{3,r})(r,e)\right\rvert
&=\lvert r\rvert\lvert e\rvert^4.
\end{aligned}$$

For any local coordinate expression $G$ of $g$ on a neighborhood meeting $D$, set $J_D:=\operatorname{ord}_D(\operatorname{Jac}(G))$. The coordinate invariance established in Section 7 makes this independent of the chosen charts. We write $\operatorname{ord}_D(F):=\operatorname{ord}_D(F\circ g)$, and similarly for $K$.

The table entries can now be read directly from these factorizations. If $D=\{z=0\}$ on a coordinate neighborhood and

$$F\circ g\circ\kappa=z^a\alpha,\qquad
\left\lvert\operatorname{Jac}(g\circ\kappa)\right\rvert
=\lvert z\rvert^b\beta,$$

with $\alpha|_D\not\equiv0$ and $\beta|_D\not\equiv0$, then $\operatorname{ord}_D(F)=a$ and $J_D=b$. In the $\kappa_{3,c}$-chart, the relevant defining coordinates and exponent pairs are therefore

$$S''':z:=d-1\Rightarrow(a,b)=(1,0),\qquad
E_2':z:=d\Rightarrow(a,b)=(3,2),\qquad
E_3:z:=c\Rightarrow(a,b)=(6,4).$$

In the companion chart, $E_1''=\{r=0\}$, and the factors $r^2$ and $\lvert r\rvert$ give $(a,b)=(2,1)$. Finally, $K=F^2/2$ has twice the vanishing order of $F$ because the nonzero constant $1/2$ does not affect orders. Thus,

$$\begin{array}{c|cccc}
D&S'''&E_1''&E_2'&E_3\\ \hline
\operatorname{ord}_D(F)&1&2&3&6\\
\operatorname{ord}_D(K)&2&4&6&12\\
J_D&0&1&2&4
\end{array}$$

The candidate attached to $D$ is $(J_D+1)/\operatorname{ord}_D(K)$, giving $1/2,1/2,1/2,$ and $5/12$. The last is the unique minimum: only the coordinate defining $E_3$ attains $\lambda=5/12$. Hence $m=1$, so there is no logarithmic factor, and an amplitude positive at the cusp gives

$$Z_n\asymp n^{-5/12}.$$

The ordinary $n^{-1/2}$ behavior along smooth points of the curve is therefore dominated by the slower concentration at the cusp.

{{< cusp-sticky-end >}}

{{< interactive-figure src="/hironaka-resolution/monomial-integral/?v=linear-bounds-numbering-1" title="Interactive geometry of a monomial integral" size="large" caption="Change n or compare the monomial examples, including a flat coordinate. Figure P specifies the integral evaluated numerically over [-1,1]²; the dashed comparison has the predicted power and logarithmic multiplicity, with its constant fitted at the largest n shown." >}}

## 10. Statistical application: evidence and cumulative predictive risk

The preceding sections have supplied the two deterministic ingredients needed for a statistical application. Near the transformed zero set, monomialization gives resolved coordinates in which $K(g(u))=\prod_{j=1}^d u_j^{2k_j}$, after absorbing the positive analytic factor. Under Section 9's positivity condition, the resulting population integral satisfies

$$Z_t:=\int_\Omega e^{-tK(w)}\varphi(w)\,dw
\asymp t^{-\lambda}(\log t)^{m-1}
\qquad(t\to\infty).$$

Let $X_1,\ldots,X_n$ be independent and identically distributed with Lebesgue density $q$, and let $p_w$, $w\in\Omega$, be model densities on the same observation space, jointly measurable in $(w,x)$. Choose a KL-minimizing model density $p_*=p_{w_*}$ with $D_*:=\operatorname{KL}(q\,\|\,p_*)<\infty$. The true density need not belong to the model. Use the standard empirical-process notation

$$Ph:=\mathbb E_q[h(X)],\qquad
P_nh:=\frac1n\sum_{i=1}^n h(X_i),\qquad
\mathbb G_nh:=\sqrt n(P_n-P)h.$$

Measure log loss relative to $p_*$ by setting $f_w(x):=\log(p_*(x)/p_w(x))$. The population excess loss and its empirical version are

$$K(w):=Pf_w=\operatorname{KL}(q\,\|\,p_w)-D_*\geq0,\qquad
\widehat K_n(w):=P_nf_w.$$

The following are sufficient conditions for the evidence and cumulative-risk conclusions below:

1. **Prior and geometry.** The prior density $\varphi$ is normalized, nonnegative, continuous, and compactly supported in $\Omega$. Retain Section 9's positivity condition for the rate $(\lambda,m)$, and assume no positive prior mass on open components where $K\equiv0$.
2. **Analytic log ratios in mean square.** The log ratios are jointly measurable in $(w,x)$. On an open neighborhood of the prior support, they are finite $q$-almost surely for each $w$, and $w\mapsto f_w$ is analytic into $L^2(q)$. Concretely, locally $f_w=\sum_\alpha c_\alpha(w-w_0)^\alpha$ with $\sum_\alpha\lVert c_\alpha\rVert_{L^2(q)}r^{|\alpha|}<\infty$ for some $r>0$. Pointwise analyticity alone is not this condition. Since expectation is a continuous linear functional on $L^2(q)$, $K=Pf_w$ is real analytic.
3. **Fluctuations vanish with excess loss.** On an open neighborhood of $K^{-1}(0)\cap\operatorname{supp}\varphi$, there is a constant $C<\infty$ such that $P(f_w^2)\leq CK(w)$.

The finite KL baseline and these conditions provide the integrability used below; having a Lebesgue density alone would not suffice. Condition 3 rules out competing minimizers in the region under study whose densities differ on a set of positive $q$-probability; misspecification itself is compatible with the condition. The argument below uses second-moment bounds for the log ratios.

Apply Section 7 to this population loss $K$ and fix a resolution map $g:M\to U$, where $U\subseteq\Omega$ is an open neighborhood of the prior support. We also write $g(u)$ for its expression in a resolved coordinate chart. This map is fixed independently of the sample and of $n$.

Write $X^i:=(X_1,\ldots,X_i)$ and $p_w^i(X^i):=\prod_{j=1}^i p_w(X_j)$, with the empty product equal to $1$. Independent likelihood ratios multiply, so the evidence normalized by the best-fitting model is

$$A_n:=\frac{\int_\Omega p_w^n(X^n)\varphi(w)\,dw}{p_*^n(X^n)}
=\int_\Omega e^{-n\widehat K_n(w)}\varphi(w)\,dw.$$

Thus $A_n$ is the random evidence ratio relative to $p_*$. By contrast, $Z_n$ replaces $\widehat K_n$ by its population mean before exponentiating; in particular, $Z_n$ is neither $A_n$ nor $\mathbb E[A_n]$. When the model is well specified, take $p_*=q$ and $D_*=0$.

To connect evidence to prediction, let $\Pi(dw\mid X^i)$ be the ordinary Bayesian posterior after $i$ observations and define its predictive density by

$$p_i^{\mathrm{pred}}(x):=\int_\Omega p_w(x)\,\Pi(dw\mid X^i).$$

For $i=0$, this uses the prior. Bayesian evidence factors into successive predictive densities, so, with $A_0:=1$,

$$A_n=\prod_{i=0}^{n-1}\frac{p_i^{\mathrm{pred}}(X_{i+1})}{p_*(X_{i+1})}.$$

The evidence comparison proved below ensures $0<A_i<\infty$ almost surely and $\mathbb E|\log A_i|<\infty$ for each fixed $i$. Together with $D_*<\infty$, this justifies the following expectations. Conditional on $X^i$, the expected negative logarithm of the $i$th ratio is $\operatorname{KL}(q\,\|\,p_i^{\mathrm{pred}})-D_*$. Thus cumulative predictive risk relative to the truth satisfies the exact identity

$$R_n:=\sum_{i=0}^{n-1}\mathbb E_{X^i\sim q^i}\!\left[\operatorname{KL}(q\,\|\,p_i^{\mathrm{pred}})\right]
=nD_*+\mathbb E_{q^n}[-\log A_n].$$

The term $nD_*$ is the cumulative risk of always predicting with $p_*$; $\mathbb E[-\log A_n]$ measures the difference for Bayesian prediction. A predictive mixture need not belong to the model, so its KL risk at a single prediction step can be below $D_*$. The increment identity is still

$$R_{n+1}-R_n
=\mathbb E_{X^n\sim q^n}\!\left[\operatorname{KL}(q\,\|\,p_n^{\mathrm{pred}})\right].$$

The evidence calculation thus studies accumulated predictive risk; the risk of the next prediction is its one-observation increment.

### Controlling the empirical fluctuations

To transfer the deterministic exponents to $A_n$, pointwise convergence of $\widehat K_n$ is not enough: the relevant parameter neighborhoods shrink with $n$. The usual empirical-process identity is

$$\widehat K_n(w)-K(w)=\frac1{\sqrt n}\mathbb G_n f_w.$$

Even a uniform bound $\sup_w|\mathbb G_n f_w|=O_p(1)$ would only bound the loss error by $O_p(n^{-1/2})$, allowing an error of order $\sqrt n$ in the exponent. Here $O_p(1)$ means bounded in probability as $n\to\infty$. Near the zero set we need a sharper bound that decreases with $K(w)$. This requires information about the family of log-density ratios beyond the geometry of their mean $K$.

Conditions 2 and 3 let us derive the required factorization directly from the monomialization of $K$. Near the part of the transformed zero set above the prior support, shrink each chart so that condition 3 holds throughout its image and absorb the positive analytic factor in $K\circ g$. There exists an $L^2(q)$-valued analytic family $u\mapsto a_u$ such that

$$K(g(u))=\prod_{j=1}^d u_j^{2k_j},\qquad
f_{g(u)}(x)=\left(\prod_{j=1}^d u_j^{k_j}\right)a_u(x),$$

where the $k_j$ are the nonnegative integer exponents from Section 9 and the second equality holds in $L^2(q)$ for every $u$ in the chart. To prove this, condition 3 gives

$$\lVert f_{g(u)}\rVert_{L^2(q)}\leq\sqrt C\prod_j|u_j|^{k_j}.$$

Expand the $L^2(q)$-valued analytic family $f_{g(u)}$ in one coordinate $u_j$, holding all other coordinates fixed and nonzero. The displayed norm bound forces every coefficient of degree less than $k_j$ in $u_j$ to vanish: a first nonzero coefficient of lower degree would contradict the bound as $u_j\to0$. These coefficient functions are continuous in the other coordinates, so they also vanish when some of those coordinates are zero. Applying this argument to every $j$ shows that the joint power series contains only monomials divisible by $\prod_j u_j^{k_j}$. Factoring out this product leaves a convergent $L^2(q)$-valued power series on a smaller chart, proving the claim.

For the pointwise empirical-process statements below, write $\widetilde f_w$ for the representative of the $L^2(q)$ log ratio supplied by its power series in the original parameter coordinates, and define

$$\widetilde K_n(w):=P_n\widetilde f_w=\frac1n\sum_{i=1}^n\widetilde f_w(X_i).$$

The construction and its simultaneous validity in the parameters are justified below. We retain $f_w$ for the original log ratio and $\widehat K_n=P_nf_w$ for its empirical loss; since $P\widetilde f_w=Pf_w$, the population loss remains $K$.

Taking expectations and dividing where the monomial is nonzero gives $Pa_u=\prod_j u_j^{k_j}$; continuity extends this identity across its zero set. Thus $\mathbb G_n a_u=\sqrt n(P_na_u-Pa_u)$ is an ordinary centered empirical process indexed by the resolved coordinates. For the series-defined representatives, the factorization holds simultaneously in $u$ on an event of probability one, as justified below. Linearity then gives the exact identity

$$\widetilde K_n(g(u))-K(g(u))
=\frac1{\sqrt n}\left(\prod_{j=1}^d u_j^{k_j}\right)\mathbb G_n a_u.$$

The algebraic identity alone gives no stronger fluctuation bound: the remaining process could in principle grow as the extracted factor shrinks. The regularity just proved prevents this. First, condition 3 gives, wherever $K(g(u))>0$,

$$P(a_u^2)=\frac{P(\widetilde f_{g(u)}^2)}{K(g(u))}\leq C.$$

Continuity extends this bound to the zero set. To control the supremum of the process, we use the analytic power series to obtain a bound that works simultaneously at every parameter value. On a small box $\lVert v-v_0\rVert_\infty\leq r$, write

$$h_v=\sum_\alpha c_\alpha(v-v_0)^\alpha,
\qquad\sum_\alpha r^{|\alpha|}\lVert c_\alpha\rVert_{L^2(q)}<\infty.$$

There is a small distinction between an $L^2(q)$ identity and evaluating functions at the observed data. In $L^2(q)$, functions that differ only on a set of $q$-probability zero represent the same element. But that exceptional set may depend on the parameter, so agreement almost everywhere at each fixed parameter does not by itself give agreement simultaneously over the supremum above.

We therefore choose measurable representatives of the countably many coefficients and define actual functions by the power series. Such a choice is called a **version**: it agrees with the original function $q$-almost everywhere at each fixed parameter. Minkowski's inequality for partial sums, followed by monotone convergence, gives

$$H(x):=\sum_\alpha r^{|\alpha|}|c_\alpha(x)|,\qquad
\lVert H\rVert_{L^2(q)}\leq\sum_\alpha r^{|\alpha|}\lVert c_\alpha\rVert_{L^2(q)}<\infty.$$

Thus $H$ is finite outside one null set, and the series converges absolutely and uniformly throughout the box there. Apply this construction to $f_w$ in the original parameter coordinates and to each chart's family $a_u$. Equality on countable dense subsets, followed by continuity, makes the local representatives of $f_w$ agree on overlaps and gives $\widetilde f_{g(u)}=u^ka_u$ simultaneously throughout each resolved chart. Here $u^k:=\prod_j u_j^{k_j}$; the factors $a_u$ themselves remain chart-dependent. The relevant covers can be chosen countable, so a single set of observations of $q$-probability one suffices for all these identities. Define the representatives to be zero on its complement. This gives a jointly measurable $\widetilde f_w$ near the prior support, continuous in $w$ for almost every observation.

When integrating against the prior, we will verify that replacing $f_w$ by $\widetilde f_w$ leaves the evidence unchanged almost surely. The continuity of the chosen representatives also makes all suprema below measurable: they can be taken over countable dense subsets.

First fix a sample in this probability-one event. Absolute convergence, linearity of $\mathbb G_n$, the ordinary triangle inequality, and $|(v-v_0)^\alpha|\leq r^{|\alpha|}$ give

$$\sup_{\lVert v-v_0\rVert_\infty\leq r}|\mathbb G_n h_v|
\leq\sum_\alpha r^{|\alpha|}|\mathbb G_n c_\alpha|.$$

Second, take the root mean square over the sample and apply **Minkowski's inequality**:

$$\left(\mathbb E\sup_{\lVert v-v_0\rVert_\infty\leq r}|\mathbb G_n h_v|^2\right)^{1/2}
\leq\sum_\alpha r^{|\alpha|}\left(\mathbb E|\mathbb G_n c_\alpha|^2\right)^{1/2}.$$

Third, independence of the observations gives

$$\mathbb E|\mathbb G_n c_\alpha|^2
=\operatorname{Var}_q(c_\alpha(X))
\leq\lVert c_\alpha\rVert_{L^2(q)}^2.$$

So the preceding bound is at most

$$\sum_\alpha r^{|\alpha|}\lVert c_\alpha\rVert_{L^2(q)}<\infty,$$

independently of $n$. This coefficient summability justifies applying $P_n-P$ term by term and passing from finite partial sums to the displayed uniform $L^2$ bound. Applying the bound to $a_u$ on finitely many such boxes covering a compact subset of the current chart yields

$$\sup_n\mathbb E\!\left[\sup_u|\mathbb G_n a_u|^2\right]<\infty,
\qquad\text{hence}\qquad
\sup_u|\mathbb G_n a_u|=O_p(1).$$

Here and in the next two displays, each supremum is over that compact subset of this one chart. The moment bound follows from conditions 2 and 3 and will let us take expectations in the evidence comparison. A pointwise central limit theorem alone would not supply this uniform control. This is the factorization and empirical-process mechanism used in singular learning theory (compare Watanabe 2009, Theorem 5.8 and Chapter 6); the argument here establishes only the bounds needed below, without invoking the stronger predictive asymptotics.

This explains why we work with $\mathbb G_n a_u$: bounding it controls the fluctuations of $\widetilde K_n$ relative to $\sqrt K$. Since $\left|\prod_j u_j^{k_j}\right|=\sqrt{K(g(u))}$, we obtain the simultaneous bound

$$\left|\widetilde K_n(g(u))-K(g(u))\right|
\leq\sqrt{\frac{K(g(u))}{n}}\;\sup_v|\mathbb G_n a_v|.$$

The same bounded-in-probability factor works at every point of this compact chart subset, while $\sqrt{K(g(u))}$ tends to zero. In particular, the exact perturbation in the exponent is

$$n\left|\widetilde K_n(g(u))-K(g(u))\right|
=\sqrt{nK(g(u))}\,|\mathbb G_n a_u|.$$

Where $nK(g(u))=O(1)$, the random perturbation in the exponent is therefore only $O_p(1)$. We now assemble the single-chart bounds over the whole prior support. Properness makes $g^{-1}(\operatorname{supp}\varphi)$ compact, so cover this preimage by finitely many compact subsets, each contained in a coordinate chart. Near the zero set, use the factorizations proved above. On each additional chart away from the zero set, simply define

$$a_u:=\frac{\widetilde f_{g(u)}}{\sqrt{K(g(u))}}.$$

The positive square root and its reciprocal are analytic there, so condition 2 makes this an $L^2(q)$-analytic family as well. Thus the same power-series argument applies on every chart, and every chart satisfies

$$|\mathbb G_n \widetilde f_{g(u)}|=\sqrt{K(g(u))}\,|\mathbb G_n a_u|.$$

Only for this assembly step, label the charts by $\ell=1,\ldots,N$. Write $g_\ell$ for the coordinate expression of the blow-down map, $a_{\ell,u}$ for the family on that chart, and $C_\ell$ for its chosen compact coordinate subset. Define

$$B_{n,\ell}:=\sup_{u\in C_\ell}|\mathbb G_n a_{\ell,u}|,
\qquad B_n:=\max_{1\leq\ell\leq N}B_{n,\ell}.$$

Each chart has $\sup_n\mathbb E[B_{n,\ell}^2]<\infty$, so

$$\sup_n\mathbb E[B_n^2]
\leq\sum_{\ell=1}^N\sup_n\mathbb E[B_{n,\ell}^2]<\infty.$$

No independence between charts is needed. Every $w$ in the prior support has a lift represented by some $u\in C_\ell$ with $g_\ell(u)=w$; applying that chart's bound gives, throughout the prior support,

$$|\widetilde K_n(w)-K(w)|\leq B_n\sqrt{\frac{K(w)}n}.$$

Fix $0<\delta<1$. Young's inequality $|ab|\leq\delta a^2+b^2/(4\delta)$ now gives

$$n|\widetilde K_n(w)-K(w)|\leq\delta nK(w)+C_n,
\qquad C_n:=\frac{B_n^2}{4\delta},
\qquad\sup_n\mathbb E[C_n]<\infty.$$

This absorbs the fluctuation into a fraction of the population loss plus a remainder independent of $w$. Equivalently,

$$-(1+\delta)nK(w)-C_n
\leq-n\widetilde K_n(w)
\leq-(1-\delta)nK(w)+C_n.$$

Exponentiating and integrating against the prior first bounds the evidence computed from the series-defined log ratios. Set

$$\widetilde A_n:=\int_\Omega
\exp\left(-\sum_{i=1}^n\widetilde f_w(X_i)\right)\varphi(w)\,dw.$$

The bounds above give $e^{-C_n}Z_{(1+\delta)n}\leq\widetilde A_n\leq e^{C_n}Z_{(1-\delta)n}$. To transfer them to the original evidence $A_n$, we now show that $\widetilde A_n=A_n$ almost surely. Let $E_w$ be the event that the series-defined log ratio $\widetilde f_w$ and the original log ratio $f_w$ disagree at some observation in the sample:

$$E_w:=\{\exists i\leq n:\ \widetilde f_w(X_i)\ne f_w(X_i)\}.$$

For each fixed $w$ in the prior support, every individual disagreement has probability zero, so $\mathbb P_{X^n\sim q^n}(E_w)=0$ as well. Outside its neighborhood, set $\widetilde f_w=f_w$. Joint measurability lets us apply Fubini--Tonelli to interchange expectation over the whole sample $X^n\sim q^n$ and integration over $w$ against the prior:

$$\mathbb E_{X^n\sim q^n}\!\left[\int_\Omega
\mathbf 1_{E_w}\varphi(w)\,dw\right]
=\int_\Omega\mathbb P_{X^n\sim q^n}(E_w)\varphi(w)\,dw=0.$$

The integral inside the expectation is the prior mass of parameters where the versions disagree on the sample. It is nonnegative, so it is zero almost surely. Thus, for almost every sample, the two sums of log ratios agree at prior-almost every parameter. Their exponentials therefore have the same prior integral, proving $\widetilde A_n=A_n$. We obtain the comparison for the original evidence, almost surely for each $n$:

$$e^{-C_n}Z_{(1+\delta)n}
\leq A_n
\leq e^{C_n}Z_{(1-\delta)n}.$$

For every fixed $c>0$, the deterministic rate gives

$$-\log Z_{cn}=\lambda\log n-(m-1)\log\log n+O(1),$$

because $\log(cn)=\log n+\log c$ and $\log\log(cn)=\log\log n+o(1)$. Since $C_n=O_p(1)$, the sandwich first yields

$$A_n=n^{-\lambda}(\log n)^{m-1}e^{O_p(1)},\qquad
-\log A_n=\lambda\log n-(m-1)\log\log n+O_p(1).$$

This is the **stochastic transfer**: the monomial exponents that determine $Z_n$ also determine the rate of evidence normalized by $p_*$. Under misspecification, normalization by $q$ would add $\sum_{i=1}^n\log(q(X_i)/p_*(X_i))$ to the negative log evidence. Its expectation is $nD_*$, but its centered fluctuations need not be $O_p(1)$.

### From evidence to cumulative predictive risk

For cumulative predictive risk, take negative logarithms and expectations directly in the global sandwich:

$$-\log Z_{(1-\delta)n}-\mathbb E[C_n]
\leq R_n-nD_*
\leq-\log Z_{(1+\delta)n}+\mathbb E[C_n].$$

The uniform bound on $\mathbb E[C_n]$ and the deterministic asymptotics therefore prove

$$R_n=nD_*+\lambda\log n-(m-1)\log\log n+O(1).$$

The geometric exponent $\lambda$ determines the logarithmic cumulative cost above the fixed predictor $p_*$, and $m$ supplies the $\log\log n$ correction. In the well-specified case $D_*=0$, this is the entire cumulative-risk expansion. No separate uniform-integrability assumption on the log-evidence remainder is needed: the empirical-process moment bound already controls its expected absolute size. Using only $O_p(1)$ would lose this information.

The exact increment identity does not let us obtain the next-prediction risk simply by subtracting this expansion at $n+1$ and $n$: an $O(1)$ remainder need not have increments of order $o(1/n)$. Under the assumptions of Watanabe's stronger predictive theorem, ordinary Bayes in the well-specified setting satisfies

$$\mathbb E\!\left[\operatorname{KL}(q\,\|\,p_n^{\mathrm{pred}})\right]
=\frac{\lambda}{n}+o(n^{-1})$$

(Watanabe 2010, Lemma 3 and the discussion following Theorem 2, pp. 3584--85, with inverse temperature $\beta=1$). This is an outlook result under that theorem's assumptions; the argument above does not derive it from conditions 1--3. The cited paper assumes $L^s(q)$ analyticity with $s\geq8$ (Section 2.3.1, p. 3577), as well as its own prior and parameter-space hypotheses. Those are sufficient assumptions for its results, not a claim that eighth moments are necessary. We do not derive next-prediction asymptotics here, in either the well-specified or misspecified case.

{{< remark title="full-support priors" >}}
Compact support lets us carry out the calculation in finitely many charts. For a full-support prior on a possibly unbounded domain, choose a smooth cutoff $0\leq\chi\leq1$ with compact support in $\Omega$. Suppose the preceding local assumptions hold for $\chi\varphi$, giving the rate $r_n:=n^{-\lambda}(\log n)^{m-1}$. The full $Z_n$ and $A_n$ inherit the same deterministic and in-probability exponents if the omitted integrals, with amplitude $(1-\chi)\varphi$, are respectively $o(r_n)$ and $o_p(r_n)$. These tail conditions alone do not transfer the expected cumulative-risk expansion: that also requires control of the expected log-evidence contribution from the tails. A sufficient condition is $\mathbb E[\log(A_n/A_n^\chi)]=O(1)$, where $A_n^\chi$ is the evidence integral with amplitude $\chi\varphi$; normalizing this fixed localized prior changes its log evidence only by a constant. A proper prior alone does not guarantee these conditions. The compact argument above therefore remains separate from the model-dependent analysis of full-support tails.
{{< /remark >}}

For the cusp model, we can verify the sufficient conditions directly and illustrate the fluctuation bound in the original parameters. Take $p_{u,v}=N(v^2-u^3,1)$ and $q=N(0,1)$, and put $F(u,v):=v^2-u^3$. Then

$$\begin{aligned}
f_{(u,v)}(x)&=\frac12F(u,v)^2-xF(u,v),\\
\widehat K_n(u,v)&=\frac12F(u,v)^2-F(u,v)\bar X_n,
\end{aligned}$$

where $\bar X_n:=n^{-1}\sum_iX_i$. For the function $h(x)=x$, $\mathbb G_n h=\sqrt n\,\bar X_n\sim N(0,1)$, so

$$\mathbb G_n f_{(u,v)}=-F(u,v)\mathbb G_n h.$$

The sufficient conditions can be checked directly: $f_{(u,v)}$ is a polynomial in the parameters with coefficients in $L^2(q)$, and

$$P(f_{(u,v)}^2)=F(u,v)^2+\frac14F(u,v)^4=2K(u,v)+K(u,v)^2
\leq(2+\varepsilon)K(u,v)\quad\text{when }K(u,v)\leq\varepsilon.$$

The empirical fluctuation is a single Gaussian sample-mean fluctuation multiplied by the same factor $F$ whose square gives $2K$. With a compactly supported continuous prior positive at the cusp, the comparison above transfers the rate already computed:

$$A_n=n^{-5/12}e^{O_p(1)},\qquad -\log A_n=\frac5{12}\log n+O_p(1).$$

Here $|\mathbb G_n f_{(u,v)}|=\sqrt{2K(u,v)}\,|\mathbb G_n h|$ throughout the support, so $B_n=\sqrt2|\mathbb G_n h|$ has $\mathbb E[B_n^2]=2$. The same comparison therefore also gives $R_n=(5/12)\log n+O(1)$ directly.

The same model illustrates misspecification with little extra work. Let $q$ be any density with mean zero and finite variance $\tau^2$, and assume $D_*:=\operatorname{KL}(q\,\|\,N(0,1))<\infty$. Then $p_*=N(0,1)$, $f_{(u,v)}$ and $K=F^2/2$ keep the same formulas, and $P(f_{(u,v)}^2)=2\tau^2K+K^2$. Thus conditions 2 and 3 still hold, with $\mathbb E[B_n^2]=2\tau^2$, and

$$R_n=nD_*+\frac5{12}\log n+O(1).$$

The geometric calculation and empirical-process moment bound together determine the evidence rate and cumulative predictive risk. We can now collect the deterministic part into a reusable recipe.

## 11. The recipe

The calculation can now be summarized as follows. Let $\Omega$ be the open parameter domain, let $K$ be nonnegative and real analytic on $\Omega$, and let $\varphi$ be a nonnegative continuous localizing amplitude whose support is compact and contained in $\Omega$. The two-sided rate requires Section 9's positivity condition, checked in step 5 below.

1. **Separate open components on which the loss vanishes identically.** Let $\Omega_0$ be the union of the connected components of $\Omega$ on which $K\equiv0$, and set

   $$C_0:=\int_{\Omega_0}\varphi(w)\,dw,
   \qquad
   Z_n^{\mathrm{dec}}:=Z_n-C_0.$$

   The term $C_0$ is independent of $n$; if it is positive, it is already the nondecaying leading term. The remaining steps analyze $Z_n^{\mathrm{dec}}$.

2. **Monomialize and localize the remaining loss.** Choose a finite composition of blow-ups giving a proper map $g$ for which $K\circ g$ is monomial over the compact region of interest. Cover the transformed zeros above the remaining support by finitely many coordinate neighborhoods as in Section 9: all zero-set components meeting a neighborhood must pass through its chosen reference point on the resolved support. Add neighborhoods covering the compact remainder away from the zero set, and choose a nonnegative subordinate partition of unity. This writes $Z_n^{\mathrm{dec}}$ as a finite sum of localized contributions. The partition functions only localize the integral; the rate data will be attached to the transformed zero components and their intersections.

3. **Discard zero-free contributions and record the component ratios.** If the compact support of a localized contribution does not meet $(K\circ g)^{-1}(0)$, then $K\circ g\geq c>0$ there and its contribution is $O(e^{-cn})$. Discard it from the power-and-logarithm comparison. In each remaining chart, after absorbing the positive analytic factor in $K\circ g$, write

   $$K(g(u))=\prod_{j=1}^d u_j^{2k_j},\qquad
   \lvert\det Dg(u)\rvert=b(u)\prod_{j=1}^d\lvert u_j\rvert^{J_j},$$

   where $b$ is positive and nonvanishing and at least one $k_j$ is positive. Each hyperplane $D_j:=\{u_j=0\}$ with $k_j>0$ is a local hypersurface component of the transformed zero set: either an exceptional component or a hypersurface component of the final strict transform. Attach to it

   $$a_{D_j}:=\operatorname{ord}_{D_j}(K\circ g)=2k_j,\qquad
   J_{D_j}:=\operatorname{ord}_{D_j}(\operatorname{Jac}(g))=J_j,\qquad
   \lambda_{D_j}:=\frac{J_{D_j}+1}{a_{D_j}}.$$

   These quantities belong to the geometric component, not to a partition summand. The product of $\varphi\circ g$, $b$, and a partition function is merely the localized continuous factor. If no zero-meeting contribution remains, the residual integral is exponentially small and steps 4--5 are unnecessary.

4. **Find the slowest component ratio.** Write $C:=g^{-1}(\operatorname{supp}\varphi)$ in the remaining resolved region, and let $\mathcal D_C$ be the finite collection of transformed zero components that meet $C$. Include components even where the amplitude vanishes. Set

   $$\lambda_*:=\min_{D\in\mathcal D_C}\lambda_D,
   \qquad
   \mathcal D_*:=\{D\in\mathcal D_C:\lambda_D=\lambda_*\}.$$

   This gives the candidate power of $n$. Charts are needed to calculate the orders in step 3, but the resulting ratios belong to the components and can now be compared directly.

5. **Count minimizing components that meet and check positivity.** Set

   $$m_*:=\max\left\{\lvert S\rvert:
   S\subseteq\mathcal D_*,\quad
   \left(\bigcap_{D\in S}D\right)\cap C\ne\varnothing
   \right\}.$$

   In words, $m_*$ is the largest number of components with the minimizing ratio that meet on $C$. The finite localized cover gives the upper bound $O(n^{-\lambda_*}(\log n)^{m_*-1})$. Now require that at least one intersection attaining $m_*$ contains a point $q$ with $\varphi(g(q))>0$. Continuity gives the matching local lower bound there, and nonnegativity prevents cancellation. If this positivity condition fails, only the upper bound is established; analyze the amplitude's vanishing before claiming an exact rate. When it holds,

   $$Z_n^{\mathrm{dec}}\asymp n^{-\lambda_*}(\log n)^{m_*-1},
   \qquad
   Z_n=C_0+Z_n^{\mathrm{dec}}.$$

After the constant and exponentially small pieces have been separated, monomialization makes a hierarchy of directional approach data survive successive location limits and records it in monomial exponents. Logarithms then convert those exponents into linear constraints. Once the vanishing exponents $k_j$ and the Jacobian exponents $J_j$ are known, the asymptotic rate can be read off directly.

## References

- Bierstone, E. and Milman, P. D. (1997). [“Canonical desingularization in characteristic zero by blowing up the maximum strata of a local invariant.”](https://doi.org/10.1007/s002220050141) *Inventiones Mathematicae* 128, 207–302. See equation (1.2), p. 213; Theorem 1.10 and the following Jacobian statement, pp. 216–17; Theorem 2.4, p. 229; and Theorem 13.4 together with the stated noncompact extension of Theorem 1.10, pp. 298–99.
- Bierstone, E. and Milman, P. D. (2012). [“Resolution except for minimal singularities I.”](https://doi.org/10.1016/j.aim.2012.08.002) *Advances in Mathematics* 231, 3022–3053. See Definitions 1.3, Theorem 3.4, and the analytic-version statement in Section 1.
- Hironaka, H. (1964a). [“Resolution of singularities of an algebraic variety over a field of characteristic zero: I.”](https://doi.org/10.2307/1970486) *Annals of Mathematics*, Second Series, 79(1), 109–203.
- Hironaka, H. (1964b). [“Resolution of singularities of an algebraic variety over a field of characteristic zero: II.”](https://doi.org/10.2307/1970547) *Annals of Mathematics*, Second Series, 79(2), 205–326.
- Watanabe, S. (2009). [*Algebraic Geometry and Statistical Learning Theory.*](https://doi.org/10.1017/CBO9780511800474) Cambridge Monographs on Applied and Computational Mathematics 25. Cambridge University Press. See Sections 2.4–2.5 and Chapter 3 for the geometry, Chapter 4 for the singular integrals, and Chapters 5–6 for the empirical-process and statistical arguments.
- Watanabe, S. (2010). [“Asymptotic Equivalence of Bayes Cross Validation and Widely Applicable Information Criterion in Singular Learning Theory.”](https://www.jmlr.org/papers/v11/watanabe10a.html) *Journal of Machine Learning Research* 11, 3571–3594. See Lemma 3 and the discussion following Theorem 2, pp. 3584–85, for the expected predictive risk at inverse temperature $\beta=1$.
- Watanabe, S. (2013). [“A Widely Applicable Bayesian Information Criterion.”](https://www.jmlr.org/papers/v14/watanabe13a.html) *Journal of Machine Learning Research* 14(27), 867–897. See the standing setup and Fundamental Conditions, pp. 870–72; the standard representation, Theorem 1, p. 873; the prior-weighted component ratios, p. 874; and the resolved empirical process, p. 881.
