import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

const CookingBasicsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Cooking Basics Section */}
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {getTranslation('cookingBasicsTitle', language)}
          </h1>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            {language === 'ro' ? (
              <>
                {/* Read Recipe Thoroughly */}
                <section>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📖 Citiți Rețeta Complet Înainte de a Începe
                  </h2>
                  <p className="leading-relaxed text-base">
                    Înainte de a începe să gătiți, citiți întreaga rețetă de la început până la sfârșit. 
                    Acest lucru vă ajută să înțelegeți pașii și să vă pregătiți mental pentru proces. 
                    Veți evita surprizele neplăcute, cum ar fi descoperirea că aveți nevoie de un ingredient 
                    pe care nu îl aveți sau că un pas necesită timp suplimentar de așteptare.
                  </p>
                  <p className="leading-relaxed mt-2 text-base">
                    Verificați dacă aveți toate echipamentele necesare (tigăi, oale, ustensile) și 
                    asigurați-vă că înțelegeți termenii de gătit folosiți în rețetă. Dacă întâlniți 
                    ceva necunoscut, căutați informații înainte de a începe.
                  </p>
                </section>

                {/* Mise en Place */}
                <section>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔪 Pregătiți Toate Ingredientele (Mise en Place)
                  </h2>
                  <p className="leading-relaxed">
                    "Mise en place" este un termen francez care înseamnă "totul la locul său". 
                    Pregătiți și măsurați toate ingredientele înainte de a începe să gătiți. 
                    Acest lucru face procesul de gătit mai fluid, mai plăcut și mai puțin stresant.
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Ce înseamnă pregătirea ingredientelor:</p>
                    <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                      <li>Spălați și curățați toate legumele și fructele</li>
                      <li>Tăiați, feliați sau mărunțiți ingredientele conform instrucțiunilor</li>
                      <li>Măsurați cantitățile exacte și puneți-le în boluri separate</li>
                      <li>Aduceți ingredientele la temperatura camerei dacă este necesar</li>
                      <li>Pregătiți condimentele și sosurile</li>
                      <li>Preîncălziți cuptorul dacă este necesar</li>
                    </ul>
                  </div>
                  <p className="leading-relaxed mt-4">
                    Când toate ingredientele sunt pregătite, puteți să vă concentrați pe tehnicile 
                    de gătit și pe momentul potrivit, fără să vă grăbiți să tăiați ceva în timp ce 
                    altceva se gătește pe foc.
                  </p>
                </section>

                {/* Pantry Staples */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    🏺 Produse de Bază pentru Cămară
                  </h2>
                  <p className="leading-relaxed">
                    O cămară bine aprovizionată este cheia pentru a putea găti oricând doriți, 
                    fără să fie nevoie să mergeți la magazin pentru fiecare rețetă. Iată o listă 
                    de ingrediente esențiale pe care ar trebui să le aveți întotdeauna:
                  </p>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Uleiuri și Grăsimi
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Ulei de măsline (pentru salate și gătit la temperaturi medii)</li>
                        <li>Ulei vegetal sau de floarea-soarelui (pentru prăjit)</li>
                        <li>Unt (pentru gătit și copt)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Condimente și Mirodenii
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Sare (de masă și grunjoasă)</li>
                        <li>Piper negru (proaspăt măcinat este cel mai bun)</li>
                        <li>Usturoi (proaspăt sau pudră)</li>
                        <li>Ceapă (galbenă, roșie, sau verde)</li>
                        <li>Boia de ardei (dulce și iute)</li>
                        <li>Oregano, busuioc, cimbru (uscate)</li>
                        <li>Scorțișoară, nucșoară</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Produse de Bază
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Făină (albă și integrală)</li>
                        <li>Zahăr (alb și brun)</li>
                        <li>Orez (alb cu bob lung, arborio pentru risotto)</li>
                        <li>Paste (spaghete, penne, fusilli)</li>
                        <li>Conserve de roșii (cuburi, pasată, bulion)</li>
                        <li>Bulion de pui sau legume (cuburi sau lichid)</li>
                        <li>Oțet (de vin, balsamic, de mere)</li>
                        <li>Sos de soia</li>
                        <li>Miere</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Produse pentru Copt
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Praf de copt</li>
                        <li>Bicarbonat de sodiu</li>
                        <li>Drojdie (uscată sau proaspătă)</li>
                        <li>Extract de vanilie</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Alte Esențiale
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Ouă (păstrați întotdeauna în frigider)</li>
                        <li>Lapte și smântână (pentru gătit)</li>
                        <li>Brânză rasă (parmezan, cașcaval)</li>
                        <li>Cartofi (se păstrează bine la loc întunecos și răcoros)</li>
                        <li>Morcovi (versatili și se păstrează bine)</li>
                      </ul>
                    </div>
                  </div>

                  <p className="leading-relaxed mt-6">
                    Cu aceste ingrediente de bază, puteți pregăti o varietate largă de rețete, 
                    de la mâncăruri simple de zi cu zi până la preparate mai elaborate pentru 
                    ocazii speciale. Verificați periodic cămara și înlocuiți produsele expirate 
                    sau terminate.
                  </p>
                </section>

                {/* Additional Tips */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    💡 Sfaturi Suplimentare
                  </h2>
                  <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                    <li>
                      <strong>Gustați pe parcurs:</strong> Verificați și ajustați condimentarea 
                      în timpul gătitului, nu doar la sfârșit.
                    </li>
                    <li>
                      <strong>Folosiți ingrediente proaspete:</strong> Calitatea ingredientelor 
                      influențează direct gustul final al preparatului.
                    </li>
                    <li>
                      <strong>Nu vă grăbiți:</strong> Respectați timpii de gătit și nu încercați 
                      să accelerați procesul crescând temperatura.
                    </li>
                    <li>
                      <strong>Curățați pe parcurs:</strong> Spălați vasele și curățați suprafețele 
                      în timp ce gătiți pentru a evita dezordinea.
                    </li>
                    <li>
                      <strong>Învățați din greșeli:</strong> Fiecare rețetă este o oportunitate 
                      de a învăța ceva nou. Nu vă descurajați dacă ceva nu iese perfect prima dată.
                    </li>
                  </ul>
                </section>
              </>
            ) : (
              <>
                {/* Read Recipe Thoroughly */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    📖 Read the Recipe Thoroughly Before Starting
                  </h2>
                  <p className="leading-relaxed">
                    Before you start cooking, read the entire recipe from start to finish. 
                    This helps you understand the steps and mentally prepare for the process. 
                    You'll avoid unpleasant surprises, such as discovering you need an ingredient 
                    you don't have or that a step requires additional waiting time.
                  </p>
                  <p className="leading-relaxed mt-4">
                    Check if you have all the necessary equipment (pans, pots, utensils) and 
                    make sure you understand the cooking terms used in the recipe. If you encounter 
                    something unfamiliar, look it up before you begin.
                  </p>
                </section>

                {/* Mise en Place */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    🔪 Prepare All Ingredients (Mise en Place)
                  </h2>
                  <p className="leading-relaxed">
                    "Mise en place" is a French term meaning "everything in its place". 
                    Prepare and measure all ingredients before you start cooking. 
                    This makes the cooking process smoother, more enjoyable, and less stressful.
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold mb-2">What ingredient preparation means:</p>
                    <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                      <li>Wash and clean all vegetables and fruits</li>
                      <li>Cut, slice, or chop ingredients according to instructions</li>
                      <li>Measure exact quantities and place them in separate bowls</li>
                      <li>Bring ingredients to room temperature if necessary</li>
                      <li>Prepare seasonings and sauces</li>
                      <li>Preheat the oven if needed</li>
                    </ul>
                  </div>
                  <p className="leading-relaxed mt-4">
                    When all ingredients are prepared, you can focus on cooking techniques 
                    and proper timing, without rushing to chop something while something else 
                    is cooking on the stove.
                  </p>
                </section>

                {/* Pantry Staples */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    🏺 Pantry Staples
                  </h2>
                  <p className="leading-relaxed">
                    A well-stocked pantry is the key to being able to cook whenever you want, 
                    without having to go to the store for every recipe. Here's a list 
                    of essential ingredients you should always have:
                  </p>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Oils and Fats
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Olive oil (for salads and cooking at medium temperatures)</li>
                        <li>Vegetable or sunflower oil (for frying)</li>
                        <li>Butter (for cooking and baking)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Seasonings and Spices
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Salt (table and coarse)</li>
                        <li>Black pepper (freshly ground is best)</li>
                        <li>Garlic (fresh or powder)</li>
                        <li>Onion (yellow, red, or green)</li>
                        <li>Paprika (sweet and hot)</li>
                        <li>Oregano, basil, thyme (dried)</li>
                        <li>Cinnamon, nutmeg</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Basic Products
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Flour (white and whole wheat)</li>
                        <li>Sugar (white and brown)</li>
                        <li>Rice (long-grain white, arborio for risotto)</li>
                        <li>Pasta (spaghetti, penne, fusilli)</li>
                        <li>Canned tomatoes (diced, pureed, paste)</li>
                        <li>Chicken or vegetable broth (cubes or liquid)</li>
                        <li>Vinegar (wine, balsamic, apple cider)</li>
                        <li>Soy sauce</li>
                        <li>Honey</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Baking Products
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Baking powder</li>
                        <li>Baking soda</li>
                        <li>Yeast (dry or fresh)</li>
                        <li>Vanilla extract</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Other Essentials
                      </h3>
                      <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
                        <li>Eggs (always keep in the refrigerator)</li>
                        <li>Milk and cream (for cooking)</li>
                        <li>Grated cheese (parmesan, cheddar)</li>
                        <li>Potatoes (store well in a dark, cool place)</li>
                        <li>Carrots (versatile and store well)</li>
                      </ul>
                    </div>
                  </div>

                  <p className="leading-relaxed mt-6">
                    With these basic ingredients, you can prepare a wide variety of recipes, 
                    from simple everyday meals to more elaborate dishes for special occasions. 
                    Check your pantry regularly and replace expired or depleted products.
                  </p>
                </section>

                {/* Additional Tips */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    💡 Additional Tips
                  </h2>
                  <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
                    <li>
                      <strong>Taste as you go:</strong> Check and adjust seasoning 
                      during cooking, not just at the end.
                    </li>
                    <li>
                      <strong>Use fresh ingredients:</strong> The quality of ingredients 
                      directly influences the final taste of the dish.
                    </li>
                    <li>
                      <strong>Don't rush:</strong> Respect cooking times and don't try 
                      to speed up the process by increasing the temperature.
                    </li>
                    <li>
                      <strong>Clean as you go:</strong> Wash dishes and clean surfaces 
                      while cooking to avoid clutter.
                    </li>
                    <li>
                      <strong>Learn from mistakes:</strong> Every recipe is an opportunity 
                      to learn something new. Don't get discouraged if something doesn't turn out perfect the first time.
                    </li>
                  </ul>
                </section>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default CookingBasicsPage;
