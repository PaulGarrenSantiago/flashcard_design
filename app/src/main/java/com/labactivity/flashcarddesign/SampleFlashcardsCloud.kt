package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcardsBinding

class SampleFlashcardsCloud : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcardsBinding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("application migration", "big data analytics", "cloud", "cloud computing", "cloud infrastructure", "cloud storage", "data integration", "data migration", "elastic computing", "face recognition", "grid computing", "hybrid cloud computing", "machine learning")
    private val descriptions = arrayOf("The process of moving applications from one computing environment to another, often as part of a cloud adoption strategy. Organizations can migrate their applications from on-premises servers to the cloud as well as from one cloud to another.",
        "Consists of the tools, systems, and applications that companies use to gather, process, and gain insights from vast, high-velocity datasets. These complex datasets originate from various sources, including the internet, emails, social media, and smart devices.",
        "A metaphor for a global computing network of remote servers that run applications, store data, and deliver content and services. The cloud enables data to be accessed online from internet-enabled devices, rather than solely from local computers.",
        "A delivery model for computing resources in which various servers, applications, data, and other resources are integrated and provided as a service over the internet. Resources are often virtualized, and users typically only pay for the services they use.",
        "The hardware and software components used to deliver cloud computing services over the internet. These components include servers, storage, networking equipment, and virtualization technology.",
        "Groups of networked computers that act together to perform large tasks, such as analyzing huge sets of data and weather modeling. Cloud computing lets you use vast computer grids for specific time periods and purposes, paying only for your usage, and saving the time and expense of purchasing and deploying the necessary resources yourself.",
        "The process of combining and consolidating data from several different sources into a single system with a unified view.",
        "Transferring data from one storage location, like an on-premises server, to a different location, like the server of a cloud provider. Data migration encompasses selecting, preparing, extracting, and transferring data from one computer storage system to another.",
        "The ability to dynamically provision and de-provision computer processing, memory, and storage resources to meet changing demands without worrying about capacity planning and engineering for peak usage.",
        "A personal identification technology that relies on optical analysis to analyze an image. Face recognition can be used for face identification, grouping, and verification.",
        "A service that uses a group of networked computers working together as a virtual supercomputer to perform large or data-intensive tasks.",
        "A type of computing where on-premises datacenters are combined with cloud computing products and services in order to modernize legacy resources. This allows businesses to improve IT performance, optimize costs, and instantly scale capacity up or down.",
        "The process of using mathematical models to predict outcomes instead of relying on a set of instructions. Machine learning works by identifying patterns within data, building an analytical model, and using it to make predictions and decisions. The process bears similarity to how humans learn, in that increased experience can increase accuracy.")

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