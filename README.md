# String Algorithms Visualizer
## 
In this project, I have tried to animate some commonly used string algorithms.

---
### 
The application supports the following algorithms:    
1.Given a text and a pattern, find all the occurrences of the pattern in the text.

>Naive String Matching Algorithm: For every starting character in text, we start matching character by character with the pattern, and if we match all characters of pattern, then we found a match, else we continue our search from the next character.
>    
>Knuth-Morris-Pratt aka KMP Algorithm: Here we build the prefix array i.e, the longest prefix which is also a suffix ending at position i. In general we build the failure function on pattern, and then use it on multiple streams of text to find whether this pattern appears in the text.
>Here, instead of just building the prefix function, I also take the text from user and see it in action.
>  
>Z Function: Also known as extended KMP. Here we build the Z array, the longest string starting at i which is also the prefix of this string. In this algorithm, we maintain the rightmost
>string which is also a suffix. Then if the current index is within this range, we find the mirror position and take it as a starting point. Then we run a naive algorithm of extending this rightmost range.
   
2.Given a string find all the palindromes in O(N).
>Manacher's Algorithm:The algorithm maintains the rightmost found palindrome. To find the palindromic range centered at ith element
>, we check if this index is in the range of rightmost found palindrome. If yes, then we find the mirror position in the current palindrome, and take this as an initial point. 
>Then we run a naive algorithm of expanding this rightmost range.   
>In a similar manner we can find the even palindromes which are centered at the gap between two consecutive characters.   
  
3.Given a dictionary of words and a pattern, check if the pattern is present in the dictionary.
>Trie Data Structure: We store the strings in a tree like structure. And we also store the frequency of each character in this tree.

### Implementation
Try here: [**String Algorithms Visualizer**](https://string-algorithms-visualizer.herokuapp.com/)