## app.tsx
### bugs
[ ] info lag one image behind actual displayed image
    [ ] could be caused by getting 2 on the first one, and not updating the image
### features
[ ] add a button to generate more of a certain kind. 
    [ ] button  
        [ ] styling
            [ ] #9f2f90?  
            [ ] #7f3fb0?  
            [ ] #fa00af?  
            [ ] #af00fa?  
            [ ] #b03f7f?  
    [ ] functionality (frontend)  
    [ ] functionality (backend)    
    [ ] slider/other to determine number of things generated  
    [ ] decide whether to do the style/prompt   selection on the frontend, or backend  
        [-] frontend  
            1. we could have a get request like  genmore/<style>/<prompt>
            2. we could have a get request like   genmore/<base64id>  
        [x] backend  
            1. the id and prompt are already in memory  
    [ ] write the prompt/style out to the `styles.txt` and `prompts.txt`  