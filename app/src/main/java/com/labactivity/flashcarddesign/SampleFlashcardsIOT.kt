package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcardsBinding

class SampleFlashcardsIOT : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcardsBinding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("Advanced Encryption Standards", "Beacon Technology", "Cloud Computing", "Embedded Software", "Gateway", "Link Budget", "Lora Protocol", "Mesh Network", "Quality of Service", "RF Geolocation")
    private val descriptions = arrayOf("This is an electronic data encryption specification that has been the standard for IoT device transport layer security since 2001.",
        "This permits small network transmitters to interact with systems utilizing low-power Bluetooth. Apple’s version is called iBeacon.",
        "Remotes servers connected via a network and used for data storage, processing, and management, instead of relying on a local, in-house physical server.",
        "The computer software that controls hardware devices and systems that are not usually considered computers, like a smart refrigerator, for instance.",
        "This is any device that gathers information from various network points and sends that information on to another network.",
        "This is a telecommunication system jargon that describes an accounting of all of the gains and losses going from a transmitter, passing through the medium, and ending up at the receiver.",
        "A long-range digital wireless communication technique to facilitate IoT and M2M communications.",
        "A network system where devices transmit their data while also serving as relays to other nodes.",
        "A measurement of how well a network supports IT connectivity. This covers elements such as transmission delays, availability of connections, and data loss.",
        "Otherwise known as using a radio transceiver to find another radio transceiver. The classic example of this is the ever-popular GPS, found in many models of cars.")

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