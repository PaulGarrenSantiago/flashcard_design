package com.labactivity.flashcarddesign

import android.content.Intent
import android.os.Bundle
import android.widget.SearchView
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.contains
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.labactivity.flashcarddesign.databinding.ActivityMyFlashcardsBinding
import com.labactivity.flashcarddesign.databinding.CategoriesBinding
import com.labactivity.flashcarddesign.databinding.RecyclerflashcardsBinding

class MyFlashcards : AppCompatActivity() {
    private lateinit var binding:ActivityMyFlashcardsBinding
    private lateinit var recyclerView: RecyclerView



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMyFlashcardsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            NavigationHandler.handleNavigation(this, binding.bottomNavigation, item.itemId)
            true
        }
        recyclerView = binding.myList
        recyclerView.layoutManager = LinearLayoutManager(this)

        val items = listOf(
            FlashcardsList(R.drawable.flashcardimage, "Introduction to Kotlin"),
            FlashcardsList(R.drawable.proglang, "Programming Languages"),
        )

        recyclerView.adapter = FlashcardAdapter(items)
    }
}