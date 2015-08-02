---
layout: post
title: "A few zsh tricks"
date: 2013-11-09 17:53
comments: true
categories: [shell, zsh, command-line] 
---
Here are a few zsh tricks that I learned (and enjoy using) recently:

#### The basics - use !! to retrieve last command
```
tail /var/log/message
!!
```
#### The not so basic - get last parameter of last command with !$
```
mkdir new_folder
cd !$	# after this command you will be in folder new_folder
```

#### Get all parameters from the last command with !*
```
diff src/file1 dest/
cp !*
```

#### The pretty awsome - substitution with !!:s/_from_/_to_ or !!:gs/_from_/_to_
```
	vi src/en/file.txt
	!!:s/en/fr
```
	diff src/en/file.txt dest/en/file.txt
	!!:gs/en/fr		# g for global substitution

#### Even better with ^
```
	vi src/en/file.txt
	^en^fr

	diff src/en/file.txt dest/en/file.txt
	^en^fr^:G	
```

#### Switching between directories with similar structure (added Dec 7, 2013)
let's say you are in ~/dev/myproject1/src/lib/, and you want to cd to  ~/dev/myproject2/src/lib/, all you need to do is
```
cd myproject1 myproject2
```
or even
```
cd 1 2
```

#### Batch renaming with zmv
```
	autoload zmv
	zmv '(*).txt' '$1.dat'	# change *.txt to *.dat
```
see more zmv examples at [http://zshwiki.org/home/builtin/functions/zmv](http://zshwiki.org/home/builtin/functions/zmv)
