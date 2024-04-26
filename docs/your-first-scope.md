---
title: Your First Scope
---

# Your First Scope

Let's walk through creating your first scope. You can use the sample data in this guide or use your own data and follow along.
To use the sample data you can [download this csv](https://storage.googleapis.com/fun-data/latent-scope/examples/dvs-survey/datavis-misunderstood.csv) 
of survey questions and answers from the Data Visualization Society annual survey.

## Starting the tool
If you've already [installed & configured](/install-and-config) Latent Scope, you can start the web UI 
```bash
cd ~/latent-scope-data
ls-serve
```

and visit http://localhost:5001


## Uploading your data



## The process

### Embedding

### UMAP

### Cluster

### Auto-Label

By default we just label each cluster with it's index. 

If you are resource constrained locally, you can use the `nltk` model to get the top 3 (non-stopword) words from each cluster as the label.  

You can also use an LLM to label each cluster, there are transformer models you can run locally as well as 3rd party models you can run if you've setup your API key (see the [Install & Configure section](/install-and-config) or add them in http://localhost:5001/settings).

### Scope