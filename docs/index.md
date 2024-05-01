---
toc: true
---


# Latent Scope
Latent Scope is an open source tool for interactively curating unstructured data. The tool enables a repeatable process for embedding, projecting, clustering, summarizing and visualizating text data.

<a href="https://github.com/enjalot/latent-scope">GitHub</a>
<a href="https://pypi.org/project/latentscope/">Python Module</a>
<a href="https://github.com/enjalot/latent-scope-observable-examples">Examples Source</a>

## Examples
You can see the kind of analysis enabled by Latent Scope in the following examples:
* [plot issues](/plot-issues) - [data export page]() | [YouTube]()
* [us federal laws](/us-federal-laws) - [data export page]() | [YouTube]()
* [datavis survey]
* [tweets]


## Inputs and Outputs
To use Latent Scope you will need some data to input. This can be in the form of a CSV file, parquet file or a Pandas DataFrame. 
You will choose which column in your dataset has the text data you want to use.  

The process will then go through a series of steps that result in a "scope", which is essentially a few columns that get added to your dataset. The important columns are `x` and`y` which represent 2D coordinates of your embedding projected via UMAP. 
There are also a `cluster` and `label` columns which give you a unique cluster id as well as a human readable label for the cluster the point is assigned to.

## Getting started
First, take a couple minutes to [install and configure the tool]() and then you can [make your first scope!]()