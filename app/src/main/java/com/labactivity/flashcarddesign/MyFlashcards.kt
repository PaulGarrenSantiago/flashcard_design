package com.labactivity.flashcarddesign

import android.content.Intent
import android.os.Bundle
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import com.labactivity.flashcarddesign.databinding.ActivityMyFlashcardsBinding
import com.labactivity.flashcarddesign.databinding.CategoriesBinding

class MyFlashcards : AppCompatActivity() {
    private lateinit var binding:ActivityMyFlashcardsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMyFlashcardsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            NavigationHandler.handleNavigation(this, binding.bottomNavigation, item.itemId)
            true
        }

        binding.flashcard.setOnClickListener(){
            val intent = Intent(this, SampleFlashcards::class.java)
            startActivity(intent)
        }
    }
}