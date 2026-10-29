/* Configurazione Tailwind (colori e font del sito) */
tailwind.config = {
  theme: { extend: {
    colors: {
      gold: { 200:'#efe2bd', 300:'#e2cb93', 400:'#d4b062', 500:'#c5a059', 600:'#a8843f' },
      ink: { 950:'#09090b', 900:'#1e1f25', 800:'#272830', 700:'#32333c', 600:'#41424d' }
    },
    fontFamily: { serif:['"Cormorant Garamond"','serif'], sans:['Inter','sans-serif'] }
  }}
}
