package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.labactivity.flashcarddesign.databinding.HomeBinding
import com.labactivity.flashcarddesign.databinding.HomescreenBinding

class HomeScreen : AppCompatActivity() {
    private lateinit var binding:HomeBinding
    private lateinit var recyclerView: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = HomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            NavigationHandler.handleNavigation(this, binding.bottomNavigation, item.itemId)
            true
        }

        recyclerView = binding.myList
        recyclerView.layoutManager = GridLayoutManager(this,2)

        val items = listOf(
            GridList(R.drawable.proglang, "Information Technology", "Understanding different Programming Languages"),
            GridList(R.drawable.db, "Database \nManagement", "Optimization and Security"),
            GridList(R.drawable.app, "Mobile \nApplication \nDevelopment", "Guide to Creating Apps for Android and iOS Platforms"),
            GridList(R.drawable.cloud, "Cloud \nComputing", "Maximizing Cloud Services for Modern Computing"),
            GridList(R.drawable.gamedev, ">Game \nDevelopment", "A Deep Dive into the World of Interactive Entertainment"),
            GridList(R.drawable.inthings, "Internet of \nThings (IoT)", "Connecting the World through Smart Devices"),
        )
        recyclerView.adapter = GridRecyclerAdapter(items)
    }
}