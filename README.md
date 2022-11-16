# Wombot

An unofficial API and discord bot for [wombo.art](https://app.wombo.art/), aka Wombo Dream.
It lets you queue and download the final and intermediary images of the AI, bypassing the limitations of the official webpage.


## Installation
### requirements
1. Node JS
2. Python 3.

First, clone this repository and install the required dependencies:

```sh
git clone https://github.com/ErikRospo/WombotUI/
cd wombot
npm install
```
### Web server
Open the file [UI/index.html](UI/index.html) in a browser.
On the command line, run `python server.py`. 
Accepted images will go to [generated/accepted/*](generated/accepted/).
There will be a subdirectory for each style, and in each, a subdirectory for each prompt.

Your last 10 rejected images can be found in [generated/rejected](generated/rejected/).


### CLI

To run, modify `styles.txt` and `prompt.txt` with your desired styles and prompts respectively.
You can see a list of styles in `styles.json`.
When you are done, run the command `node multirun.js` to generate the images.
You can now view them in the Web server.

## Updates
To update the repository, run `git pull`.
To update the styles, run `node gen_next_data.js`


## Errors
For common errors, refer to `ERRORS.md`

## Disclaimer

The code in this repository is provided to you AS IS, without any kind of warranty.
I am not a lawyer, so take the following section as my opinion and not legal advice:

This script only reproduces the sequence of requests made by the website and downloads data already downloaded by the website and shown to the user, albeit only temporarily.
One could open the Developer Tools on the official website and download the same version there.
