---
layout: post
title: '第五节 色彩模型与系统'
subtitle: '色彩模型与系统'
date: 2025-5-6 20:00:00 +0800
categories: photography
author: mpxuann
cover: 'https://img.dpm.org.cn/Uploads/image/2025/02/26/19201080-hjMFEMTnz218984.jpg'
cover_author: '故宫博物院'
cover_author_link: 'https://www.dpm.org.cn/lights/royal.html'
tags: 
- 摄影
- Thomas
# pin: false
# submenu: 'begin'
---

# 加色模型RGB/减色模型CMY

![img](https://zamg9w9akqn.feishu.cn/space/api/box/stream/download/asynccode/?code=MjBlMmViN2JjOTY4OGJhNGEwNWZmNDJkMGVjYTI0NzZfMU1xM1BHa3N0UlhWNHlhU29kc3J1a2VsaEhOOGhjS3lfVG9rZW46TE9HaWJtVG5Lbzc5R1l4c0pKWmNXaDRxblFkXzE3NDY1NDc4NDY6MTc0NjU1MTQ0Nl9WNA)

![img](https://zamg9w9akqn.feishu.cn/space/api/box/stream/download/asynccode/?code=MWIxMmI5MTQ4MWRkMGZlNDE3MzRmOGJhYWNmOWEzNDlfcmNEOEM0R3hjVk1jSmM2a0h0ckdTTWVDdkczU3owUzhfVG9rZW46Q0JPc2JxU2p4b2hyS1R4UDQwRGNwRmM4bnhmXzE3NDY1NDc4NDY6MTc0NjU1MTQ0Nl9WNA)

# RGB相关调色工具

## 曲线

如果要加红色且提亮，则R通道上提

如果要加红色且压暗，则G通道和B通道下压

## 可选颜色

如果要把一个颜色调成纯正的青色，那么**青色要拉满**，**杨红和黄色也要拉到底**

## 色彩平衡

## RGB色彩通道

- RGB是一种色彩模型，即一种抽象的描述颜色的方式。
- 色彩空间是色彩具体的组织方式，一般与物理设备有关。
- 一种色彩模型下可以存在多种色彩空间，如RGB色彩模型下有sRGB 、AdobeRGB 、ProPhotoRGB等色彩空间。

# HSL：更容易理解的色彩模型

## 明度

- 明度指的是色彩的明暗程度，明度值越高，色彩越白亮，明度越低，色彩越暗黑。
- 白色明度最高，黑色明度最低。
- 相同纯度的不同色相，明度上也有所不同。彩色中黄色明度最高，紫色明度最低。

***明度是调色时最需要关注的属性***

- ***明度是色彩的骨骼，色相和纯度是色彩的皮肤。***
- ***在仿色时，优先需要匹配照片的明度。***
- *80％以上的彩色大片，在去掉色彩后仍然很精彩。*

## 饱和度

人眼感知到的色彩鲜艳程度，由**饱和度和明度共同决定**

- 很亮或者很暗的区域，会显得比较白或者比较黑，其实都不会太显色，此时怎么加减饱和度意义都不大。
- 一般来说，**提亮操作都会让色彩显得更不鲜艳，压暗操作都会让色彩显得更鲜艳。**

> 在camera raw调整HSL时，一般先调整色相和明度，再调整饱和度，因为调整明度也会改变饱和度

## HSL和HSB/HSV的区别

![img](https://zamg9w9akqn.feishu.cn/space/api/box/stream/download/asynccode/?code=NjhjN2MyNWM4YzNmMDExOGJmZGFmZDBmMzQ2NTliYTVfWk9FbkVTTThucDNLa1JFbU9zbVFldzdZbGNXTHVmT0pfVG9rZW46T3JxN2J6ajdsb0tzbHB4U28zTmNUMVUybnFnXzE3NDY1NDc4NDY6MTc0NjU1MTQ0Nl9WNA)

- 在HSL里面，亮度最高，色相和饱和度不起作用，都是纯白
- 在HSV里面，去饱和度是加白色，降低亮度是加黑色
- HSL和HSB 中的色相都是一样的，只是饱和度和明度定义不同，
- HSL中最亮一定是白色， HSB 中最亮是该色相和饱和度下的最亮色。
- HSL中明度感觉更准确，但代价是饱和度不太直观。HSB 中饱和度的感觉更准确，但代价是明度不太直观。
- 整体而言， HSL会更容易理解一些。
- Photshop中，三属性调色工具是基于HSL的，但拾色器工具和色彩读数都是基于HSB 的。

## LAB

> *PS中井没有基于HSL的通道模型，如果要把明度和色彩分通道处理，则需要LAB模式。*

CIEL *a*b* (CIELAB) 是惯常用来描述人眼可见的所有颜色的最完备的色彩模型。

- Lab色彩空间，也是一种可以描述人类所有可见颜色的色彩空间。
- LAB中的L代表明度，即纯黑到纯白的变化， A代表品红到绿色的变化， B代表黄色到蓝色的变化。

![img](https://zamg9w9akqn.feishu.cn/space/api/box/stream/download/asynccode/?code=NzQ1ODBhNTQ0N2RhYWRkMzA5YTFjNWFmNmFmOGFmZTFfTmZZUzBmMDM2aUpJVGU4ZzdaQ1RuQ3J6RjBtVWQ5SXRfVG9rZW46S0VJSmI4ak1lbzJDN3p4d1J2emNvQzh1blhiXzE3NDY1NDc4NDY6MTc0NjU1MTQ0Nl9WNA)