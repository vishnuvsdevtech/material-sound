# Material Sound

**Live:** https://vishnuvsdevtech.github.io/material-sound/

Interfaces that sound like objects. Four materials synthesised with Web Audio — paper, wood, glass, metal. No audio files.

**How:** Two primitives cover all four: white noise through a filter, and a damped sine at a chosen frequency. Wood is a 180 Hz sine with a 140 ms decay plus a noise transient; metal is the same sine at 1180 Hz with a 1.5 s tail and a second partial detuned 7 cents so they beat.

**What it is not:** Sound is off by default with a visible toggle. An interface that makes noise without permission is a bug.
