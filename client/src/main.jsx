import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './dashboard.jsx'
import Login from './login.jsx'
import { useEffect, useState } from'react';
import { io } from 'socket.io-client';
import { useNavigate, BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { useDetectAdBlock } from "adblock-detect-react";




import React from 'react'
const socket = io(import.meta.env.VITE_BACKENDHOST || 'http://localhost:5000', {
  transports: ['websocket'],  
  withCredentials: true, 
});

function Main() {


    const [isLoggedIn, setIsLoggedIn] = useState(()=> JSON.parse(localStorage.getItem('isLoggedIn')) || false);
    const [userdata, setUserdata] = useState(()=> JSON.parse(localStorage.getItem('userdata')) || 'po');
    const adBlockDetected = useDetectAdBlock();
    const frData  = [
      {
        level: 'A1-',
        activities: [
          { name: 'Apprenons le français !', modulesName: ['Parlons français !'] , modulesImg: ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_PARLONS_FRANCAIS_A1-squared.jpg'] },
          {
            name: 'Parlons français !',
            modulesName: [
              'Les voyelles principales',
              'Les voyelles : les autres sons',
              'Les voyelles : les nasales',
              'Les voyelles : les lettres « e » et « o »',
              'Les consonnes (1)',
              'Les consonnes (2)',
              'Les semi-consonnes'
            ], modulesImg : ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg',
                'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg'
                ,'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg',
                'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg',
                'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg',
                'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg',
                'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_VOYELLES_PRINCIPALES-squared.jpg']
          },
          { name: 'Apprendre le vocabulaire de base en français', modulesName: ['Français essentiel','Français de base','Les couleurs'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_FRANCAIS_ESSENTIEL-squared.jpg',
          'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_FRANCAIS_DE_BASE-squared.jpg',
          'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_COULEURS-squared.jpg'] },
          {
            name: 'Se présenter',
            modulesName: ['Les salutations', 'Se présenter', 'Mise en pratique'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_SALUTATIONS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_SE_PRESENTER_A1-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_MINUS_PRACTICE_MISE_EN_PRATIQUE_RENCONTRER_QUELQU_UN-squared.jpg']
          },
          {
            name: 'Répondre à des questions sur son identité',
            modulesName: ['Remplir un formulaire : information personnelle', 'Répondre à des questions à propos de soi'],
            modulesImg: ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_PRESENTER_QUELQU_UN_2-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_REPONDRE_A_DES_QUESTIONS_A_PROPOS_DE_SOI_A1-squared.jpg']
          },
          {
            name: 'Demander et donner un numéro de téléphone',
            modulesName: ['Les chiffres', 'Demander et donner un numéro de téléphone'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_CHIFFRES-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_DEMANDER_ET_DONNER_UN_NUMERO_DE_TELEPHONE-squared.jpg']
          },
          {
            name: 'Présenter sa famille',
            modulesName: ['Parler de sa famille'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_PARLER_DE_SA_FAMILLE_A1-squared.jpg']
          },
          {
            name: 'Parler des jours, mois, saisons',
            modulesName: ['Les mois et les saisons', 'Les jours de la semaine'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_MOIS_ET_LES_SAISONS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_JOURS_DE_LA_SEMAINE_A1-squared.jpg']
          },
          {
            name: 'Dire comment on se sent',
            modulesName: ['Les sensations et émotions'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_SENSATIONS_ET_EMOTIONS-squared.jpg']
          },
          {
            name: 'Commander de la nourriture et des boissons',
            modulesName: ['La nourriture et les boissons', 'Commander de la nourriture et des boissons'],modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LA_NOURRITURE_ET_LES_BOISSONS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_COMMANDER_DE_LA_NOURRITURE_ET_DES_BOISSONS-squared.jpg']
          },
          {
            name: 'S\'orienter en ville',
            modulesName: ['Les bâtiments', 'Demander et donner des directions']
            ,modulesImg: ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_BATIMENTS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_DEMANDER_ET_DONNER_DES_DIRECTIONS-squared.jpg']
          },
          {
            name: 'Se déplacer en ville',
            modulesName: ['Les moyens de transport', 'Trouver un moyen de transport'],
            modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_MOYENS_DE_TRANSPORT-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_TROUVER_UN_MOYEN_DE_TRANSPORT-squared.jpg']
          }
        ]
      },
      {
        level: 'A1',
        activities: [
          {
            name: 'Se présenter',
            modulesName: ['Le présent - être - premier verbe de base', 'Mise en pratique'],
            modulesImg: ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_SE_PRESENTER-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_ETRE_PREMIER_VERBE_DE_BASE-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_SE_PRESENTER_A1-squared.jpg']
          },
          {
            name: 'Répondre à des questions à propos de soi',
            modulesName: [
              'Rencontrer d\’autres personnes',
              'L\'usage du présent',
              'Le présent - avoir - deuxième verbe de base',
              'Mise en pratique'
            ],modulesImg: ['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_REPONDRE_A_DES_QUESTIONS_A_PROPOS_DE_SOI-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_RENCONTRER_QUELQU_UN_DE_NOUVEAU_UN_E_INCONNU_E-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_L_USAGE_DU_PRESENT-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_L_USAGE_DU_PRESENT-squared.jpg']
          },
          {
            name: 'Présenter sa famille',
            modulesName: [
              'Les adjectifs possessifs',
              'La place de l\'adjectif',
              'Mise en pratique'
            ],
            modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DE_SA_FAMILLE-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ADJECTIFS_POSSESSIFS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ADJECTIFS_POSSESSIFS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PRESENTER_SA_FAMILLE-squared.jpg']
          },
          {
            name: 'Décrire quelqu\'un',
            modulesName: [
              'Décrire l’apparence de quelqu’un',
              'Décrire le caractère de quelqu’un',
              'Les pronoms personnels sujets',
              'L\'accord des adjectifs - introduction',
              'L\'accord de l\'adjectif - particularités',
              'Mise en pratique'
            ],
            modulesImg:['https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_DECRIRE_L_APPARENCE_DE_QUELQU_UN-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_DECRIRE_L_APPARENCE_DE_QUELQU_UN-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRONOMS_PERSONNELS_SUJETS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRONOMS_PERSONNELS_SUJETS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRONOMS_PERSONNELS_SUJETS-squared.jpg',
            'https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRONOMS_PERSONNELS_SUJETS-squared.jpg']
          },
          {
            name: 'Dire comment on se sent',
            modulesName: [
              'Le présent - être - premier verbe de base',
              'Le présent - avoir - deuxième verbe de base',
              'Mise en pratique'
            ],
            modulesImg:[
            "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_MINUS_VOCABULARY_LES_SENSATIONS_ET_EMOTIONS-squared.jpg",
             "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_ETRE_PREMIER_VERBE_DE_BASE-squared.jpg", 
             "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_AVOIR_DEUXIEME_VERBE_DE_BASE-squared.jpg", 
             "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_DIRE_COMMENT_ON_SE_SENT-squared.jpg" 
             ]
          },
          {
            name: 'Parler de sa vie quotidienne',
            modulesName: ['Décrire sa vie quotidienne','Le présent - les verbes pronominaux','Le présent - les verbes particuliers à deux bases','Demander et donner l\'heure','Mise en pratique'],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_DECRIRE_SA_VIE_QUOTIDIENNE-squared.jpg", 
              "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_LES_VERBES_PRONOMINAUX-squared.jpg", 
              "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_LES_VERBES_PARTICULIERS_A_DEUX_BASES-squared.jpg",
             "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_DEMANDER_ET_DONNER_L_HEURE-squared.jpg",
             "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SA_VIE_QUOTIDIENNE-squared.jpg"
              ]
          },
          {
            name: 'Parler de ses loisirs',
            modulesName: [
              'Parler de ses loisirs',
              'Les principaux mots interrogatifs',
              'Pour obtenir des précisions sur les personnes ou les choses',
              'Mise en pratique'
            ],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DES_LOISIRS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRINCIPAUX_MOTS_INTERROGATIFS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_POUR_OBTENIR_DES_PRECISIONS_SUR_LES_PERSONNES_OU_LES_CHOSES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SES_LOISIRS-squared.jpg" ]
          },
          {
            name: 'Parler de ses activités du weekend',
            modulesName: [
              'Parler de son weekend',
              'Le présent - les verbes en -ER',
              'Les adverbes de temps',
              'Mise en pratique'
            ],
            modulesImg: [ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DE_SON_WEEK_END-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_LES_VERBES_EN_ER-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ADVERBES_DE_TEMPS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SES_ACTIVITES_DU_WEEKEND-squared.jpg" ]
          },
          {
            name: 'Décrire les projets de la journée',
            modulesName: [
              'Parler de ses projets pour la journée',
              'Les adjectifs démonstratifs',
              'Les connecteurs logiques - introduction',
              'Demander et donner l\'heure',
              'Mise en pratique'
            ],
            modulesImg: [ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DE_SES_PROJETS_POUR_LA_JOURNEE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ADJECTIFS_DEMONSTRATIFS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_CONNECTEURS_LOGIQUES_INTRODUCTION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_DEMANDER_ET_DONNER_L_HEURE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_DECRIRE_LES_PROJETS_DE_LA_JOURNEE-squared.jpg" ]
          },
          {
            name: 'Prévoir un repas',
            modulesName: [
              'Organiser un repas',
              'Les partitifs et l\'expression de la quantité',
              'Le singulier et le pluriel',
              'Mise en pratique'
            ]
            ,modulesImg: [  "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_ORGANISER_UN_REPAS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PARTITIFS_ET_L_EXPRESSION_DE_LA_QUANTITE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_SINGULIER_ET_LE_PLURIEL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PREVOIR_UN_REPAS-squared.jpg"   ]
          },
          {
            name: 'Commander au restaurant',
            modulesName: [
              'Manger au restaurant',
              'Les articles définis et les articles indéfinis',
              'Le présent - les verbes en -DRE',
              'Mise en pratique'
            ],
            modulesImg: [ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_MANGER_AU_RESTAURANT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ARTICLES_DEFINIS_ET_LES_ARTICLES_INDEFINIS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_LES_VERBES_EN_DRE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_COMMANDER_AU_RESTAURANT-squared.jpg"  ]
          },
          {
            name: 'Parler de sa maison',
            modulesName: [
              'Faire visiter votre domicile',
              'Les articles définis et les articles indéfinis',
              'Acheter des meubles pour votre domicile',
              'C\'est, il est, il y a, voici',
              'Mise en pratique'
            ],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_FAIRE_VISITER_VOTRE_DOMICILE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ARTICLES_DEFINIS_ET_LES_ARTICLES_INDEFINIS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_ACHETER_DES_MEUBLES_POUR_VOTRE_DOMICILE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_C_EST_IL_EST_IL_Y_A_VOICI-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SA_MAISON-squared.jpg"]
          },
          {
            name: 'Parler de sa ville',
            modulesName: [
              'Décrire votre ville',
              'Les prépositions de lieux 1',
              'Les prépositions de lieux 2',
              'Mise en pratique'
            ],
            modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_DECRIRE_VOTRE_VILLE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PREPOSITIONS_DE_LIEUX_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PREPOSITIONS_DE_LIEUX_2-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SA_VILLE-squared.jpg"]
          },
          {
            name: 'Donner des directions',
            modulesName: [
              'Demander et donner des directions - Dans la ville',
              'L\'impératif',
              'Les adverbes de lieu',
              'Mise en pratique'
            ],
            modulesImg: [ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_DEMANDER_ET_DONNER_DES_DIRECTIONS_DANS_LA_VILLE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_L_IMPERATIF-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_ADVERBES_DE_LIEU-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_DONNER_DES_DIRECTIONS-squared.jpg" ]
          },
    
          {
            name: 'Parler de ses goûts vestimentaires',
            modulesName: [
              'Acheter des vêtements',
              'Énumérer quelques couleurs',
              'Parler à un assistant commercial',
              'Mise en pratique'
            ],
                    modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_ACHETER_DES_VETEMENTS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_ENUMERER_QUELQUES_COULEURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_A_UN_ASSISTANT_COMMERCIAL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SES_GOUTS_VESTIMENTAIRES-squared.jpg"]
    
          },
        
          {
            name: 'Passer un appel téléphonique',
            modulesName: [
              'Passer un appel téléphonique',
              'Parler de problèmes de transports et de voyages',
              'Les principaux mots interrogatifs',
              'Les prépositions et indicateurs de temps',
              'Mise en pratique'
            ],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PASSER_UN_APPEL_TELEPHONIQUE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DE_PROBLEMES_DE_TRANSPORTS_ET_DE_VOYAGES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PRINCIPAUX_MOTS_INTERROGATIFS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_PREPOSITIONS_ET_INDICATEURS_DE_TEMPS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PASSER_UN_APPEL_TELEPHONIQUE-squared.jpg" ]
          },
          {
            name: 'Chercher un nouveau travail',
            modulesName: [
              'Chercher un nouveau travail',
              'Faire des projets',
              'Le futur',
              'Le présent - les particularités orthographiques des verbes en -ER',
              'Mise en pratique'
            ],
            modulesImg: [ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_CHERCHER_UN_NOUVEAU_TRAVAIL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_FAIRE_DES_PROJET-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_FUTUR-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PRESENT_LES_PARTICULARITES_ORTHOGRAPHIQUES_DES_VERBES_EN_ER-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_CHERCHER_UN_NOUVEAU_TRAVAIL-squared.jpg" ]
          },
          {
            name: 'Parler de l\'époque où on était étudiant',
            modulesName: [
              'Parler du passé - Vie étudiante',
              'Le passé composé des autres verbes',
              'La place de l\'adverbe',
              'Mise en pratique'
            ],
            modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DU_PASSE_VIE_ETUDIANTE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_PASSE_COMPOSE_DES_AUTRES_VERBES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LA_PLACE_DE_L_ADVERBE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_L_EPOQUE_OU_ON_ETAIT_ETUDIANT-squared.jpg" ]
          },  {
            name: 'Parler de ses futures vacances',
            modulesName: [
              'Parler de ses projets de vacances',
              'Le futur',
              'Les nombres de 20 à 100',
              'Demander et donner la date',
              'Mise en pratique'
            ],
            modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A1_VOCABULARY_PARLER_DE_SES_PROJETS_DE_VACANCES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LE_FUTUR-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_LES_NOMBRES_DE_20_A_100-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_DEMANDER_ET_DONNER_LA_DATE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SES_FUTURES_VACANCES-squared.jpg"]
           }
        ]
      },
      {
        level: 'A2',
        activities: [
          {
            name: 'Parler de sa scolarité',
            modulesName: [
              'Parler de l\'école',
              'L\'imparfait',
              'Le passé composé - être ou avoir',
              'Les pronoms possessifs',
              'Mise en pratique'
            ],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_VOCABULARY_PARLER_DE_L_ECOLE_PARTIE_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_L_IMPARFAIT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LE_PASSE_COMPOSE_ETRE_OU_AVOIR-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_PRONOMS_POSSESSIFS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SA_SCOLARITE-squared.jpg"]
          },
          {
            name: 'Parler de la vie universitaire',
            modulesName: [
              'Parler de la vie universitaire',
              'Le passé composé - être ou avoir',
              'Le futur simple - formation',
              'Le futur simple - emploi',
              'Les connecteurs logiques',
              'Mise en pratique'
            ],
            modulesImg:[  "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_VOCABULARY_PARLER_DE_LA_VIE_UNIVERSITAIRE_PARTIE_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LE_PASSE_COMPOSE_ETRE_OU_AVOIR-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LE_FUTUR_SIMPLE_FORMATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LE_FUTUR_SIMPLE_EMPLOI-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_CONNECTEURS_LOGIQUES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_LA_VIE_UNIVERSITAIRE-squared.jpg"  ]
          },
          // {
          //   name: 'Communiquer par téléphone en milieu professionnel',
          //   modulesName: [
          //     'Communiquer par téléphone en milieu professionnel',
          //     'Les connecteurs logiques',
          //     'Les pronoms relatifs « qui » et « que »',
          //     'Les pronoms directs (CD) et indirects (CI)'
          //   ],
          //   modulesImg:[
          //     "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_JOB_COMMUNIQUER_PAR_TELEPHONE_EN_MILIEU_PROFESSIONNEL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_CONNECTEURS_LOGIQUES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_PRONOMS_RELATIFS_QUI_ET_QUE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_PRONOMS_DIRECTS_COD_ET_INDIRECTS_COI-squared.jpg"
          //   ]
          // },
          {
            name: 'Prendre un rendez-vous par téléphone',
            modulesName: [
              'Fixer un rendez-vous par téléphone',
              'L\'interrogation - quelques précisions',
              'Les pronoms directs (CD) et indirects (CI)',
              'Demander et donner l\'heure',
              'Demander et donner la date',
              'Mise en pratique'
            ],
            modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_VOCABULARY_PARLER_AU_TELEPHONE_PARTIE_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_L_INTERROGATION_QUELQUES_PRECISIONS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_PRONOMS_DIRECTS_COD_ET_INDIRECTS_COI-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_DEMANDER_ET_DONNER_L_HEURE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A1_GRAMMAR_DEMANDER_ET_DONNER_LA_DATE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_PRACTICE_MISE_EN_PRATIQUE_PRENDRE_UN_RENDEZ_VOUS_PAR_TELEPHONE-squared.jpg"
            ]
          },
          {
            name: 'Envoyer une candidature par courriel',
            modulesName: [
              'Communiquer par courriel',
              'Révision du présent',
              'Les connecteurs logiques',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_VOCABULARY_COMMUNIQUER_PAR_COURRIEL_PARTIE_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_REVISION_DU_PRESENT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_CONNECTEURS_LOGIQUES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_PRACTICE_MISE_EN_PRATIQUE_ENVOYER_UNE_CANDIDATURE_PAR_COURRIEL-squared.jpg"
            ]
          },
          {
            name: 'Passer un entretien d\'embauche',
            modulesName: [
              'Chercher un emploi',
              'Le passé composé - être ou avoir',
              'L\'imparfait',
              'Les connecteurs logiques',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_A2_VOCABULARY_CHERCHER_UN_EMPLOI_PARTIE_1-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LE_PASSE_COMPOSE_ETRE_OU_AVOIR-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_L_IMPARFAIT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_GRAMMAR_LES_CONNECTEURS_LOGIQUES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_A2_PRACTICE_MISE_EN_PRATIQUE_PASSER_UN_ENTRETIEN_D_EMBAUCHE-squared.jpg" 
            ]
          }
        ]
      },
      {
        level: 'B1',
        activities: [
          // {
          //   name: 'Préparer la rentrée universitaire',
          //   modulesName: [
          //     'Étudiant / Étudiante',
          //     'La cause',
          //     'Les verbes prépositionnels',
          //     'Le conditionnel présent et passé'
          //   ],
          //   modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_ETUDIANT_ETUDIANTE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_CAUSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_VERBES_PREPOSITIONNELS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_CONDITIONNEL_PRESENT_ET_PASSE-squared.jpg" ]
          // },
          // {
          //   name: 'Réviser pour un examen de médecine',
          //   modulesName: [
          //     'Étudiant / Étudiante en médecine',
          //     'Des verbes suivis du subjonctif',
          //     'Le discours rapporté',
          //     'La double pronominalisation (CD et CI)'
          //   ],
          //   modulesImg:[
          //     "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_ETUDIANT_ETUDIANTE_EN_MEDECINE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_DES_VERBES_SUIVIS_DU_SUBJONCTIF-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_DISCOURS_RAPPORTE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_DOUBLE_PRONOMINALISATION_COD_ET_COI-squared.jpg" 
          //   ]
          // },
          // {
          //   name: 'Organiser des activités qui favorisent le développement de l\'enfant',
          //   modulesName: [
          //     'Organiser des activités qui favorisent le développement de l\'enfant',
          //     'La proposition',
          //     'La concession'
          //   ],
          //   modulesImg:[
          //      "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_ORGANISER_DES_ACTIVITES_QUI_FAVORISENT_LE_DEVELOPPEMENT_DE_L_ENFANT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_PROPOSITION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_CONCESSION-squared.jpg" 
          //   ]
          // },
          // {
          //   name: 'Prendre des notes',
          //   modulesName: [
          //     'Prendre des notes',
          //     'Mise en pratique'
          //   ],
          //   modulesImg:[
          //     "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_PRENDRE_DES_NOTES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_PRENDRE_DES_NOTES-squared.jpg" 
          //   ]
          // },
          {
            name: 'Aller prendre un verre',
            modulesName: [
              'La mise en relief',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_MISE_EN_RELIEF-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_ALLER_PRENDRE_UN_VERRE-squared.jpg" 
            ]
          },
          {
            name: 'Manger au restaurant',
            modulesName: [
              'Aller au restaurant - parler du menu',
              'Aller au restaurant - le dessert et l\'addition',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_ALLER_AU_RESTAURANT_PARLER_DU_MENU-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_ALLER_AU_RESTAURANT_LE_DESSERT_ET_L_ADDITION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_MANGER_AU_RESTAURANT-squared.jpg"
            ]
          },
          {
            name: 'Faire ses courses',
            modulesName: [
              'Au supermarché',
              'À la boutique de vêtements',
              'Les pronoms indéfinis pluriels',
              'Le conditionnel présent et passé',
              'Mise en pratique'
            ],
            modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_AU_SUPERMARCHE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_A_LA_BOUTIQUE_DE_VETEMENTS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_PRONOMS_INDEFINIS_PLURIELS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_CONDITIONNEL_PRESENT_ET_PASSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_PREPARER_SA_LISTE_DE_COURSES-squared.jpg" 
            ]
          },
          {
            name: 'Expliquer un problème de santé',
            modulesName: [
              'Être malade',
              'Se sentir mal',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_ETRE_MALADE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_SE_SENTIR_MAL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_EXPLIQUER_UN_PROBLEME_DE_SANTE-squared.jpg" 
            ]
          },
          {
            name: 'Rendre visite à un docteur',
            modulesName: [
              'Prendre rendez-vous chez le médecin',
              'Symptômes et diagnostics',
              'Médecin généraliste',
              'Le conditionnel présent et passé',
              'Mise en pratique'
            ],
            modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_PRENDRE_RENDEZ_VOUS_CHEZ_LE_MEDECIN-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_SYMPTOMES_ET_DIAGNOSTICS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_MEDECIN_GENERALISTE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_CONDITIONNEL_PRESENT_ET_PASSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_RENDRE_VISITE_A_UN_DOCTEUR-squared.jpg" 
            ]
          },
          {
            name: 'Décider comment voyager',
            modulesName: [
              'En voyage - choisir un moyen de transport',
              'En voyage - prendre le métro',
              'Le conditionnel présent et passé',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_EN_VOYAGE_CHOISIR_UN_MOYEN_DE_TRANSPORT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_VOCABULARY_EN_VOYAGE_PRENDRE_LE_METRO-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_CONDITIONNEL_PRESENT_ET_PASSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_DECIDER_COMMENT_VOYAGER-squared.jpg"
            ]
          },
          {
            name: 'Donner son avis',
            modulesName: [
              'Préférez-vous être employé ou indépendant ?',
              'La cause',
              'La conséquence',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_OTHER_PREFEREZ_VOUS_ETRE_EMPLOYE_OU_INDEPENDANT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_CAUSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LA_CONSEQUENCE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_DONNER_SON_AVIS-squared.jpg" 
            ]
          },
          {
            name: 'Faire une présentation',
            modulesName: [
              'Faire une présentation',
              'Préparer une présentation - le plan',
              'Préparer une présentation - le contenu',
              'Les articulateurs de discours',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_FAIRE_UNE_PRESENTATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_PREPARER_UNE_PRESENTATION_LE_PLAN-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_PREPARER_UNE_PRESENTATION_LE_CONTENU-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_ARTICULATEURS_DE_DISCOURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_FAIRE_UNE_PRESENTATION-squared.jpg" 
            ]
          },
          {
            name: 'Commencer et terminer des appels téléphoniques ou des e-mails',
            modulesName: [
              'Contacter quelqu\'un - appels et emails',
              'Conclure un appel téléphonique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_CONTACTER_QUELQU_UN_APPELS_ET_EMAILS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_CONCLURE_UN_APPEL_TELEPHONIQUE-squared.jpg"
            ]
          },
          {
            name: 'Faire valoir ses compétences et ses qualifications',
            modulesName: [
              'Développer ses compétences numériques',
              'Écrire une lettre de motivation',
              'Rédiger un CV pour trouver un emploi',
              'Réussir un entretien d\'embauche',
              'Les articulateurs de discours',
              'L\'accord du participe passé avec un infinitif passé',
              'L\'accord du participe passé avec un pronom relatif',
              'Postuler pour un emploi - L’entretien',
              'Mise en pratique'
            ],
            modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_DEVELOPPER_SES_COMPETENCES_NUMERIQUES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_ECRIRE_UNE_LETTRE_DE_MOTIVATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_FAIRE_UN_CV_POUR_TROUVER_UN_EMPLOI-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_REUSSIR_UN_ENTRETIEN_D_EMBAUCHE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_ARTICULATEURS_DE_DISCOURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_L_ACCORD_DU_PARTICIPE_PASSE_AVEC_UN_INFINITIF_PASSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_L_ACCORD_DU_PARTICIPE_PASSE_AVEC_UN_PRONOM_RELATIF-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_POSTULER_POUR_UN_EMPLOI_L_ENTRETIEN-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_PRACTICE_MISE_EN_PRATIQUE_FAIRE_VALOIR_SES_COMPETENCES_ET_SES_QUALIFICATIONS-squared.jpg" 
            ]
          }
        ]
      },  
      {
        level: 'B2',
        activities: [
          // {
          //   name: 'Discuter des résultats d\'une recherche',
          //   modulesName: [
          //     'Assistant de recherche / Assistante de recherche',
          //     'Le conditionnel présent et passé',
          //     'L\'emploi du subjonctif - récapitulation',
          //     'La concession'
          //   ]
          //   ,modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_ASSISTANT_DE_RECHERCHE_ASSISTANTE_DE_RECHERCHE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_CONDITIONNEL_PRESENT_ET_PASSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_EMPLOI_DU_SUBJONCTIF_RECAPITULATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LA_CONCESSION-squared.jpg" ]
          // },
          // {
          //   name: 'Indiquer ses sources et rédiger une bibliographie',
          //   modulesName: [
          //     'Indiquer ses sources et rédiger une bibliographie',
          //     'Les articulateurs de discours',
          //     'L\'opposition',
          //     'Mise en pratique'
          //   ]
          //   ,modulesImg:[
          //      "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_INDIQUER_SES_SOURCES_ET_REDIGER_UNE_BIBLIOGRAPHIE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_ARTICULATEURS_DE_DISCOURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_OPPOSITION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_INDIQUER_SES_SOURCES_ET_REDIGER_UNE_BIBLIOGRAPHIE-squared.jpg"
          //   ]
          // },
          // {
          //   name: 'Rédiger un rapport de stage',
          //   modulesName: [
          //     'Faire un rapport de stage',
          //     'Les articulateurs de discours',
          //     'L\'alternance entre le passé composé et l\'imparfait',
          //     'Le plus-que-parfait',
          //     'La concordance des temps dans les phrases subordonnées',
          //     'L\'emploi du subjonctif - récapitulation',
          //     'Mise en pratique'
          //   ]
          //   ,modulesImg:[
          //     "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_FAIRE_UN_RAPPORT_DE_STAGE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_ARTICULATEURS_DE_DISCOURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_L_ALTERNANCE_ENTRE_LE_PASSE_COMPOSE_ET_L_IMPARFAIT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LE_PLUS_QUE_PARFAIT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LA_CONCORDANCE_DES_TEMPS_DANS_LES_PHRASES_SUBORDONNEES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_EMPLOI_DU_SUBJONCTIF_RECAPITULATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_REDIGER_UN_RAPPORT_DE_STAGE-squared.jpg" 
          //   ]
          // },
          // {
          //   name: 'Écrire un résumé',
          //   modulesName: [
          //     'Faire un résumé',
          //     'L\'emploi du subjonctif - récapitulation',
          //     'L\'hypothèse - avec, sans, au cas où',
          //     'Le but',
          //     'Les articulateurs de discours',
          //     'L\'adjectif verbal',
          //     'Mise en pratique'
          //   ]
          //   ,modulesImg:[
          //      "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_JOB_FAIRE_UN_RESUME-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_EMPLOI_DU_SUBJONCTIF_RECAPITULATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_HYPOTHESE_AVEC_SANS_AU_CAS_OU-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LE_BUT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B1_GRAMMAR_LES_ARTICULATEURS_DE_DISCOURS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_ADJECTIF_VERBAL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_ECRIRE_UN_RESUME-squared.jpg"
          //   ]
          // },
          {
            name: 'Comprendre un programme politique',
            modulesName: [
              'Comprendre / Faire un discours électoral',
              'L\'emploi du subjonctif - récapitulation',
              'La concordance des temps dans les phrases subordonnées',
              'Mise en pratique'
            ]
            ,modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_VOCABULARY_COMPRENDRE_FAIRE_UN_DISCOURS_ELECTORAL-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_EMPLOI_DU_SUBJONCTIF_RECAPITULATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LA_CONCORDANCE_DES_TEMPS_DANS_LES_PHRASES_SUBORDONNEES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_COMPRENDRE_UN_PROGRAMME_POLITIQUE-squared.jpg"
            ]
          },
          {
            name: 'Promouvoir le volontariat',
            modulesName: [
              'Présenter une association caritative',
              'Le gérondif',
              'Mise en pratique'
            ]
            ,modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_VOCABULARY_PRESENTER_UNE_ASSOCIATION_CARITATIVE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LE_GERONDIF-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_PROMOUVOIR_LE_VOLONTARIAT-squared.jpg" 
            ]
          },
          {
            name: 'Visiter un musée',
            modulesName: [
              'Guide touristique',
              'Mise en pratique',
              'Visiter un musée - Le Louvre'
            ]
            ,modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_VOCABULARY_VISITER_UN_MUSEE_LE_LOUVRE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_JOB_GUIDE_TOURISTIQUE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_VISITER_UN_MUSEE-squared.jpg" 
            ]
          },
          {
            name: 'Débattre de l\'éducation',
            modulesName: [
              'Débattre de l\'éducation',
              'La cause',
              'Le but',
              'Mise en pratique'
            ]
            ,modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_VOCABULARY_DEBATTRE_DE_L_EDUCATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LA_CAUSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LE_BUT-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_DEBATTRE_DE_L_EDUCATION-squared.jpg" 
            ]
          },
          {
            name: 'Parler de ses projets futurs',
            modulesName: [
              'Faire une annonce',
              'L\'emploi du subjonctif - récapitulation',
              'Mise en pratique'
            ]
            ,modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B2_VOCABULARY_FAIRE_UNE_ANNONCE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_L_EMPLOI_DU_SUBJONCTIF_RECAPITULATION-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_SES_PROJETS_FUTURS-squared.jpg" 
            ]
          },
          {
            name: 'Suggérer des manières de gérer le stress',
            modulesName: [
              'Comment faites-vous face au stress ?',
              'Les hypothèses non réalisées dans le passé, le regret'
            ]
            ,modulesImg:[
               "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_B1_OTHER_COMMENT_FAITES_VOUS_FACE_AU_STRESS-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_B2_GRAMMAR_LES_HYPOTHESES_NON_REALISEES_DANS_LE_PASSE_LE_REGRET-squared.jpg" 
            ]
          }
        ]
      },
      
      {
        level: 'C1',
        activities: [
          {
            name: 'Parler de l\'Europe',
            modulesName: [
              'Chercher un travail en Europe (l\'Union européenne, 2014)',
              'Voyager avec des denrées alimentaires (l\'Union européenne, 2014)',
              'Mise en pratique'
            ],
            modulesImg:[
              "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_C1_VOCABULARY_CHERCHER_UN_TRAVAIL_EN_EUROPE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_C1_VOCABULARY_VOYAGER_AVEC_DES_DENREES_ALIMENTAIRES-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_C1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DE_L_EUROPE-squared.jpg"
            ]
          },
          {
            name: 'Promouvoir l\'emploi des jeunes',
            modulesName: [
              'Promouvoir une garantie jeunesse (l\'Union européenne, 2014)',
              'Mise en pratique'
            ],
            modulesImg:[ "https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_C1_VOCABULARY_PROMOUVOIR_UNE_GARANTIE_JEUNESSE-squared.jpg", "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_C1_PRACTICE_MISE_EN_PRATIQUE_PROMOUVOIR_L_EMPLOI_DES_JEUNES-squared.jpg" ]
          },
          {
            name:'Parler des systèmes de santé',
            modulesName : ["Offrir des soins de santé transfrontaliers (l'Union européenne, 2014)","Identifier les inégalités de soins de santé (l'Union européenne, 2014)","Mise en pratique"],
            modulesImg:["https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_C1_VOCABULARY_OFFRIR_DES_SOINS_DE_SANTE_TRANSFRONTALIERS-squared.jpg"
              ,"https://app.ofppt-langues.ma/data/content_resources/current/overrides/lessons/FR_FR/FR_FR_C1_VOCABULARY_IDENTIFIER_LES_INEGALITES_DE_SOINS_DE_SANTE-squared.jpg",
              "https://app.ofppt-langues.ma/data/content_resources/current/lessons/FR_FR/FR_FR_C1_PRACTICE_MISE_EN_PRATIQUE_PARLER_DES_SYSTEMES_DE_SANTE-squared.jpg"]
          }
        ]
      }
    ];   
    const [blockerStatus,setBlockerStatus ]  = useState(false);

    useEffect(()=> localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn)) , [isLoggedIn] );
    useEffect(()=> localStorage.setItem('userdata', JSON.stringify(userdata)) , [userdata] );
    useEffect(()=>{
      if (adBlockDetected){
        setBlockerStatus(false);
      }
    },[adBlockDetected]);

    if(blockerStatus){
      return(
        <div className='flex flex-col items-center  justify-center w-full h-[100vh] align-middle '>
          <div className='flex justify-center align-middle items-center w-full h-full text-3xl  font-bold' style={{color:'red'}}>Vous avez activé un bloqueur publicitaire</div>
        </div>
      )
    }
  return (
    <BrowserRouter>
    
    <Routes>
    
        <Route path="/" element={!isLoggedIn?  (<Login socket={socket} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userdata={userdata} setUserdata={setUserdata} />) : (<Navigate to='/dashboard' /> )  }/>
        <Route path="/dashboard" element={isLoggedIn? (<Dashboard  socket={socket} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userdata={userdata} setUserdata={setUserdata}  frData={frData}  />) :  (<Navigate to='/' /> )  }/>
    
    </Routes>

    </BrowserRouter>
    
  )
}


createRoot(document.getElementById('root')).render(
    <Main/> 
    
)
