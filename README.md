# Game Fifteen using javacscript by Amur

<img src="./img/gamefifteen.gif" alt="Game fifteen" />

[LICENSE](LICENSE)

# Commands Git

<img width="50" src="https://gist.github.com/fluidicon.png" alt="git" />

## Connect SSH

### Configs

|Config              | Commands                                         |
|:-------------------|-------------------------------------------------:|
|add global user name| git config --global user.name "UserName"         |
|add global e-mail   | git config --global user.email "user@e-mail.com" |
|config lists        | git config --list                                |

### SSH-Keygen
    ssh-keygen -t rsa -C "user@e-mail.com"
    
    and ot press enter
    
### Create SSH

    cat ~/.ssh/id_rsa.pub
    
## Commit

<details>
    <summary>Config</summary>
    
    git status
    git add .
    git commit -a -m "your message"
    or
    git commit -am "your message"
    git pull
    git push
        
</details>

## Branch

### Get this branch

    git branch
    
### New branch

    git checkout -b name_branch
    
### Commit in new branch 
