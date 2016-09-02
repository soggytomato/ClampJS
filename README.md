# ClampJS

### What is this?

This is a voltage clamp simulator. It replicates one of the most useful experimental techniques developed in the late 1940s to study excitable biological membranes. This technique was most famously used to construct the Hodgkin-Huxley model, which is fundamental to our understanding of action potential propagation in neurons. 

The purpose of a voltage clamp is to control the voltage across a cell membrane while simultaneously recording the movement of charged ions though different types of ion channels. Actual experiments require expensive equipment and trained personnel, but we can make use of simulations to give us a basic understanding of the technique and what can be gained from it. 

### Usage

See the main HTML file for complete documentation (demo available on my [personal page](http://michaelcyau.com/vclamp)).

### Developer notes

The major drawback of stochastic ion channel simulations is speed. Initially, the easiest way to mimic individual channels is a brute-force approach: Since the rate constant (s-1) represents the expected number of transitions (forward or reverse) per second for a single channel, given some finite time step (here we see the purpose of our real-time frame duration parameter from above) we can calculate the probability that a channel flips from one state to another by a simple multiplication. 

A more efficient method, known as the CNT algorithm, was developed by Gillespie in 1977. Originally used to simulate coupled chemical reactions, the algorithm was later adapted for modeling membrane activity in neurons (also described in-depth in the above linked paper by Mino et al.). In contrast to the brute-force method, this approach uses a probability density function to calculate the time until the next transition. Essentially, the algorithm can be broken down into two steps: 1) calculating the time that will elapse until the next transition and 2) updating the number of channels in each state. Instead of deciding whether to change state for each of n channels at every time step, we perform transitions one at a time and calculate the appropriate waiting time on-the-fly. 

I wrote the simulation in javascript, mostly for accessibility/compatibility (although it does require you to use a browser supporting HTML5). No external frameworks were used - I considered using some sort of charting library, but most of them seemed a bit too fancy/heavy for the task (I just needed to draw a one-pixel width line on a graph). For now, the basic canvas drawing tools suffice and replicate what you would see in real software such as Clampex. 

### Acknowledgments

The interface uses the [Lumen](https://bootswatch.com/lumen/) theme from Bootswatch.
