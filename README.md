# P2P file sharing (Networking assignment)

In this project, we got to design a TCP-level protocol designed for P2P file sharing, perform some basic participant book-keeping and file-tranfers over the LAN.
Initially, we aimed towards the broader Internet by using some NAT-traversal techniques, but it was practically too hard.
As this is just an assignment, this is not very reliable or efficient such as:
* No fragmenting the file before sharing.
* No download recovery.
* Silently fail when the file is too large (I wonder why?? Could be some flow control problem?)

Developer's experience-wise, it ran into the problem of no watch-mode compilation, leading to testing being a pain in the neck.
