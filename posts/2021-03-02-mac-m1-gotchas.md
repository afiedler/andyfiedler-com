---
title: "Mac M1 Gotchas"
date: "2021-07-21"
---

Last updated July 21, 2021

## Monitors

- M1 Macs [don't expose DDC/CI](https://discussions.apple.com/thread/252269130), so you [can't
  use apps like MonitorControl](https://github.com/MonitorControl/MonitorControl/issues/323) to
  change volume/brightness. _Update: this seems to [fixed in Lunar](https://lunar.fyi/#m1) and hopefully coming to MonitorControl soon!_

## Development

### Visual Studio Code

- The Terminal runs in ARM64 mode, so if you want to run programs via Rosetta 2, you need to use `arch -x86_64 <command>`

### NodeJS

- No prebuild ARM64 package, so it needs to compile. Node v14.16 compiled successfully for me.
