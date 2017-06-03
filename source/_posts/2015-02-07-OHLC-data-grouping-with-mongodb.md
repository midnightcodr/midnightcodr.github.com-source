---
layout: post
title: "OHLC data grouping with mongodb"
date: 2015-02-07 12:00
comments: true
tags:
- mongodb
categories:
- programming
---
In this post I will demonstrate how to do data grouping with OHLC data using mongodb’s powerful aggregation framework.

## The problem:
Group OHLC data every N weeks where N>1, I should point out that doing weekly data grouping (when N==1) is a whole lot easier.

## Sample Data:
{% include_code mongodb_aggregation_data.js %}

## The solution:
{% include_code mongodb_aggregation.js %}

## The explanation:
The idea is to

1. get the number of weeks (floating point) since a reference date (line #8-17, all OHLC data in the db are later than that date), the reason `1970-01-04` instead of `1970-01-01` (which is Wednesday)
is chosen is because it lands on Sunday.
2. get the floored number of weeks for step 2, line #22-31, since mongodb doesn’t have a round or floor method, this is the only way to get number of week since reference date in integer.
3. sort by D, this step is crucial as the next step will need to use method such as $last and $first to get the close and open price for the grouped period.
4. group by 4 weeks’ OHLC, line #37-40, number 4 on line #41 can be substituted based on data group unit.
5. sort by _id, which consists of the calculated grouping number grp_weeknbr from previous step.

The reason why the number of weeks needs to be calculated based off a reference date is because of the partial week problem. See [this SO question](http://stackoverflow.com/questions/28389828/how-to-handle-partial-week-data-grouping-in-mongodb) that I asked before I came up with the solution documented in this post.

## Result:
{% include_code mongodb_aggregation_result.js %}

*Note*: Last group (2015-02-06) contains only one-week (first week of the group) worth of data.
