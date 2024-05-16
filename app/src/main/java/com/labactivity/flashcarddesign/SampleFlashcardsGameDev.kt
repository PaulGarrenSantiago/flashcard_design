package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcardsBinding

class SampleFlashcardsGameDev : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcardsBinding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("Asset", "Baking", "Bug", "Clipping", "Debug", "Event", "Game designer", "Game development", "Hitbox", "Mesh")
    private val descriptions = arrayOf("Shorthand for anything that goes into a video game – characters, objects, sound effects, maps, environments, etc.",
        "A method of preprocessing performed on game assets and data to ensure they load and perform well in real-time and do not slow down gameplay due to requiring a lot of processor or GPU capacity.",
        "Any development issue that makes a game unenjoyable, unstable, or unplayable in its current state.",
        "The process of predefining certain areas in a game in which rendering occurs, which optimizes game performance in those selected areas.",
        "Finding and removing bugs in a game. Sometimes referred to as “bug-bashing.”",
        "A game action that is completed through user input. When a player presses a button on their controller and the on-screen character jumps, this is considered an event.",
        "One who designs the aesthetic and structure of a game. NOTE: The terms “game designer” and “game developer” are often used interchangeably, though the two roles technically vary.",
        "The act of creating a game; sometimes referred to as “gamedev.” The game development process typically requires input from one or more game designers, artists, programmers, animators, testers, project managers, etc., though some games have been created by just one or two game developers.",
        "An invisible object created around another GameObject that determines the area where collisions with other objects will occur.",
        "A collection of vertices, edges, and faces that act as the foundation of a model in a video game.")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySampleFlashcardsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.textViewDefinition.visibility = View.INVISIBLE

        updateFlashcard(currentIndex)

        binding.flipBtn.setOnClickListener {
            flipCard()
        }
        binding.nextBtn.setOnClickListener{
            currentIndex = (currentIndex + 1) % terms.size
            updateFlashcard(currentIndex)
        }
        binding.backBtn.setOnClickListener {
            // Decrement index to show the previous term and definition
            currentIndex = (currentIndex - 1 + terms.size) % terms.size
            updateFlashcard(currentIndex)
        }
    }

    private fun flipCard() {
        if (isFront) {
            binding.textViewDefinition.visibility = View.VISIBLE
            binding.textViewTerm.visibility = View.INVISIBLE
            isFront = false
        } else {
            binding.textViewDefinition.visibility = View.INVISIBLE
            binding.textViewTerm.visibility = View.VISIBLE
            isFront = true
        }
    }


    private fun updateFlashcard(index: Int) {
        binding.textViewTerm.text = terms[index]
        binding.textViewDefinition.text = descriptions[index]
        // Show term and hide description by default
        binding.textViewTerm.visibility = View.VISIBLE
        binding.textViewDefinition.visibility = View.INVISIBLE

        // Increment index to show the page number starting from 1
        val pageNumber = index + 1
        binding.textViewCardNum.text = pageNumber.toString()
    }
}